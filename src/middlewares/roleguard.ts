import { NextFunction, Request, Response } from "express";
import * as jwt from  'jsonwebtoken';
import { AppError } from "../utils/extensions/app-error.ext";
import { HttpStatus } from "../utils/enums/httpstatus.enum";
import * as dotenv from "dotenv";
import { AuthUser } from "../entity/auth.entity";
import { Role } from "../utils/enums/auth.enum";
dotenv.config();

export class RoleGuard {
    static async canAllow(req: Request & {user: AuthUser}, res: Response, next: NextFunction) {
        try{
            const token = req.headers["authorization"]?.split(" ")[1];
            const payload = await jwt.verify(token, process.env.JWT_SECRET, {
               ignoreExpiration: false 
            }) as AuthUser;
            req.user = payload;
            if(!payload.role || payload.role !== Role.ADMIN) throw new AppError("You do not have such permissions to access this resource", HttpStatus.UNAUTHORIZED, RoleGuard.name);
            next();
        }catch(error){
            throw new AppError(error.message, HttpStatus.UNAUTHORIZED, RoleGuard.name)
        }   
    }
}