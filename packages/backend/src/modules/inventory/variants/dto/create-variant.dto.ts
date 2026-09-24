import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class CreateVariantDto {
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    productVariantId: number

    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    attributeValueId: number
}
