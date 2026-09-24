import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreatePlanDto {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description?: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsOptional()
    @IsString()
    billingCycle?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
