import { IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    firstName: string

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    lastName: string

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    email: string

    @IsString()
    @MinLength(3)
    @MaxLength(30)
    password: string

    @IsOptional()
    @IsString()
    role?: string;
}
