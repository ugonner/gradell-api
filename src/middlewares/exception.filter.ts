import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/helpers/api-response";
import { HttpStatus } from "../utils/enums/httpstatus.enum";
import { Logger } from "../services/logger.service";
import { AppError } from "../utils/extensions/app-error.ext";
import { IGenericResponse } from "../utils/typings/api-response.typings";

export class ExceptionFilter {
  static filter(
    error: AppError | Error,
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    if (error) {
      Logger.error({
        message: error.message,
        source: error instanceof AppError ? error.source: "",
        stack: error.stack,
        path: request.path,
        method: request.method
      });
      const res: IGenericResponse<unknown> = {
        status: "Error",
        message:
          error instanceof AppError
            ? error.message
            : "Something went wrong at the server",
        statusCode:
          error instanceof AppError
            ? error.status
            : HttpStatus.INTERNAL_SERVER_ERROR,
      };
      response.status(res.statusCode).json(res);
    }
  }
}
