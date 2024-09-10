import { NextFunction, Request, Response } from "express";
import * as jwt from  'jsonwebtoken';
import { AppError } from "../utils/extensions/app-error.ext";
import { HttpStatus } from "../utils/enums/httpstatus.enum";
import * as dotenv from "dotenv";
dotenv.config();

export class AuthGuard {
    static async canAllow(req: Request, res: Response, next: NextFunction) {
        try{
            const token = req.headers["authorization"]?.split(" ")[1];
            const user = await jwt.verify(token, process.env.JWT_SECRET, {
               ignoreExpiration: false 
            });
            (req as Request & {user: unknown}).user = user;
            next();
        }catch(error){
            throw new AppError(error.message, HttpStatus.UNAUTHORIZED, AuthGuard.name)
        }
    }
}