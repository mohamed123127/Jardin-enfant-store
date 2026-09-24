import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateTenantDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    slug: string;
}
