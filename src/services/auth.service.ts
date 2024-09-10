import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { AppError } from "../utils/extensions/app-error.ext";
import { HttpStatus } from "../utils/enums/httpstatus.enum";
import { AuthUser } from "../entity/auth.entity";
import { AuthDTO, CreateUserDTO } from "../dtos/auth.dto";
import * as bcrypt from 'bcryptjs';
import { Role } from "../utils/enums/auth.enum";
import * as uuid from 'uuid4';
import { AMQPService } from "./amqp.service";
import { ServiceConnections } from "../app.config";
import { Logger } from "./logger.service";
import * as jwt from 'jsonwebtoken';

export class AuthUserService {
    private AuthUserRepository: Repository<AuthUser> = AppDataSource.manager.getRepository(AuthUser);
    
    async createAuthUser(dto: CreateUserDTO): Promise<AuthUser> {
        const AuthUserExists = await this.AuthUserRepository.findOneBy({
            email: dto.email.toLowerCase()
        })
        if(AuthUserExists) throw new AppError("AuthUser with same ID already exists", HttpStatus.BAD_REQUEST, this.createAuthUser.name);
        const {email, password, ...userDto} = dto;
        const hash = await bcrypt.hash(password, 16)
        const userId = uuid();
        const AuthUser = this.AuthUserRepository.create({
            userId, email: email.toLowerCase(), password: hash, role: Role.USER
        });
        const newAuthUser = await this.AuthUserRepository.save(AuthUser);

        AMQPService.publish(ServiceConnections.user.ampqQueueName, {
            messagePattern: "USER_CREATION",
            data: {...userDto, userId}
        }).catch((err) => Logger.warn(err.message));

        return newAuthUser;
    }

    async generateAuthTokens(user: AuthUser): Promise<{
        accessToken: string;
        refreshToken: string
    }>{
        const [accessToken, refreshToken] = await Promise.all([
            jwt.sign(user, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_ACCESS_EXPIRY
            }),
            jwt.sign(user, process.env.JWT_REFRESH_SECRET, {
                expiresIn: process.env.JWT_REFRESH_EXPIRY
            })
        ]);

        return {
            accessToken, refreshToken
        }
    }
    
    async login(dto: AuthDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>{
        const user = await this.AuthUserRepository.findOneBy({
            email: dto.email.toLocaleLowerCase()
        });
        if(!user) throw new AppError("Invalid credentials", HttpStatus.NOT_FOUND, this.login.name);
        const pass = await bcrypt.compare(dto.password, user.password);
        if(!pass) throw new AppError("Invalid credentials", HttpStatus.NOT_FOUND, this.login.name);
        return await this.generateAuthTokens(user);
    }

    async getAuthUsers(): Promise<AuthUser[]> {
        return await this.AuthUserRepository.find();
    }
    

    async getAuthUser(dto: {[key: string]: unknown}): Promise<AuthUser> {
        return await this.AuthUserRepository.findOneBy(dto);
    }
    
}