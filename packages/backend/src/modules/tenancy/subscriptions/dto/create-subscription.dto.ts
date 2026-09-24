import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateSubscriptionDto {
    @IsNumber()
    tenantId: number;

    @IsNumber()
    planId: number;

    @IsOptional()
    @IsString()
    status?: string;

    @IsDateString()
    startDate: Date;

    @IsDateString()
    endDate: Date;
}
