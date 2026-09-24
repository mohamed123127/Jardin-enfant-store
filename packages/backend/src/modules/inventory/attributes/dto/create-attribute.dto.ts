import { IsString, MaxLength, MinLength } from "class-validator";
import { AttributesService } from "../attributes.service";

export class CreateAttributeDto {
    @IsString()
    @MinLength(3)
    @MaxLength(30)
    name: string
}
