import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Min,
} from 'class-validator';

export class CreateProductImageDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsString()
    @IsNotEmpty()
    @IsUrl()
    url: string;

    @IsString()
    @IsOptional()
    alt?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    position?: number;
}