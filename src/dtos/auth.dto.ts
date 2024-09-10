import { IsEmail, IsOptional, IsString, Min } from "class-validator";

export class AuthDTO {
    @IsEmail({})
    email: string;
    
    @IsString()
    @Min(8)
    password: string;
    
}

export class CreateUserDTO extends AuthDTO{
    @IsString()
    firstName: string;
    @IsString()
    lastName: string;
    
    @IsString()
    @IsOptional()
    userId?: string;
}