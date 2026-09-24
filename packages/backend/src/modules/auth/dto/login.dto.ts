import {
    IsString,
    IsNotEmpty,
    IsEmail,
} from 'class-validator';
import { LoginPayload } from '@aio/shared';

export class LoginDto implements LoginPayload {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    identifier: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}