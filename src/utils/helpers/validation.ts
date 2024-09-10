import { validate } from "class-validator";
import { ClassConstructor, plainToClass } from 'class-transformer';
import { AppError } from "../extensions/app-error.ext";
import { HttpStatus } from "../enums/httpstatus.enum";

export class DTOValidator {
    static async validate<T extends ClassConstructor<any>>(
        dto: T,
        obj: object,
      ): Promise<T>{
        const objInstance = plainToClass(dto, obj);
          const errors = await validate(objInstance);
          if (errors.length > 0) {
            throw new AppError(errors.join(' '), HttpStatus.BAD_REQUEST, DTOValidator.name);
          }
          return objInstance;
        }
    }
