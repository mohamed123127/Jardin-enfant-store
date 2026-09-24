import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class CreateProductVariantDto {
    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    quantity: number

    @IsNumber()
    @Transform(({ value }) => parseInt(value))
    productId: number
}
