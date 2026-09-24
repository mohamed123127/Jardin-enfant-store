import { Transform } from "class-transformer";
import { IsInt, IsNumber, IsOptional, Min } from "class-validator";

export class DecreaseQuantityDto {
  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  quantityToDecrease?: number;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  quantity?: number;
}
