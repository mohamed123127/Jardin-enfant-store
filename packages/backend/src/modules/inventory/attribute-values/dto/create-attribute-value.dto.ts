import { Transform } from "class-transformer";
import { IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateAttributeValueDto {
    @IsString()
    @MinLength(1)
    @MaxLength(30)
    value: string

    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    attributeId: number
}
