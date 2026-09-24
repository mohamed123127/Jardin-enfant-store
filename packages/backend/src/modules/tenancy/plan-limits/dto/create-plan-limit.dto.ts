import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreatePlanLimitDto {
    @IsNumber()
    planId: number;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    resource: string;

    @IsNumber()
    limitValue: number;
}
