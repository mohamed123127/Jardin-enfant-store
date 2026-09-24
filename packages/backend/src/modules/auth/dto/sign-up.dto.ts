import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { CreateTenantDto } from 'src/modules/tenancy/tenants/dto/create-tenant.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export class SignUpDto {

    // --- Tenant info ---
    @ValidateNested()
    @IsDefined()
    @Type(() => CreateTenantDto)
    tenant: CreateTenantDto;

    @ValidateNested()
    @IsDefined()
    @Type(() => CreateUserDto)
    user: CreateUserDto;
}
