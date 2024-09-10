import { Response } from "express";
import { IGenericResponse } from "../typings/api-response.typings";
import { HttpStatus } from "../enums/httpstatus.enum";
import axios, { AxiosHeaders, AxiosRequestConfig } from "axios";
import { AppError } from "../extensions/app-error.ext";

export class ApiResponse {
    static success<T>(message: string, data: T, statusCode?: HttpStatus): IGenericResponse<T> {
        return {
            message,
            status: "Success",
            statusCode: statusCode ? statusCode : HttpStatus.OK,
            data
        }
    }
    static error(message: string, error: unknown, statusCode?: HttpStatus): IGenericResponse<unknown> {
        return {
            message,
            status: "Error",
            statusCode: statusCode ? statusCode : HttpStatus.BAD_REQUEST,
            error
        }
    }

    static httpResponse(res: Response,message: string, status: HttpStatus, data: unknown){
        const responseData = ApiResponse.success(message,data, status)
        res.status(responseData.statusCode).json(responseData);
    }

    static async call(url: string, data: {
        method: "GET" | "POST" | "PUT" | "DELETE";
        payload: unknown;
        headers?: Partial<AxiosHeaders>


    }): Promise<IGenericResponse<unknown>>{
        try{
            const config: AxiosRequestConfig<unknown> = {
                url,
                method: data.method,
                data: data.payload ? data.payload : null,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    ...(data.headers || {} as any)
                }
                
            };
            const response = await axios.request(config);
            return response.data;
        }catch(error){
            throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR, ApiResponse.name)
        }
    }
}