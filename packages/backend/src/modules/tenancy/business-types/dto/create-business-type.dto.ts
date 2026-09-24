import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBusinessTypeDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;
}
