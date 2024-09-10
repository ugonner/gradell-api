import { Request, Response } from "express";
import { DTOValidator } from "../utils/helpers/validation";
import { AuthDTO, CreateUserDTO } from "../dtos/auth.dto";
import { AuthUserService } from "../services/auth.service";
import { ApiResponse } from "../utils/helpers/api-response";
import { HttpStatus } from "../utils/enums/httpstatus.enum";
import { AppError } from "../utils/extensions/app-error.ext";
const authService = new AuthUserService();
import * as jwt from 'jsonwebtoken';
import { AuthUser } from "../entity/auth.entity";

export class AuthController {
    static async register(req: Request, res: Response) {
        await DTOValidator.validate(CreateUserDTO, req.body);
        const result = await authService.createAuthUser(req.body);
        return ApiResponse.httpResponse(res, "User registered", HttpStatus.CREATED, result)
    }

    static async login(req: Request, res: Response) {
        await DTOValidator.validate(AuthDTO, req.body);
        const result = await authService.login(req.body);
        return ApiResponse.httpResponse(res, "User registered", HttpStatus.CREATED, result)
    }


    static async refreshToken(req: Request, res: Response) {
        const token = req.headers["authorization"]?.split(" ")[1];
        if(!token) throw new AppError("No token found", HttpStatus.BAD_REQUEST, AuthController.name);
        const payload = await jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
        const result = await authService.generateAuthTokens(payload as AuthUser)
        
        return ApiResponse.httpResponse(res, "User registered", HttpStatus.CREATED, result)
    }
}