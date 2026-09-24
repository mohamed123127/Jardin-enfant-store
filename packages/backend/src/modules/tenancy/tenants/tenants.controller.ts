import { Controller } from '@nestjs/common';
import { BaseCrudController } from 'src/common/base/controllers/base-crud.controller';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantEntity } from './entities/tenant.entity';
import { TenantsService } from './tenants.service';
import { TenantMapper } from './mappers/tenant.mapper';

@Controller('tenants')
export class TenantsController extends BaseCrudController(
    CreateTenantDto,
    UpdateTenantDto,
)<TenantEntity> {
    constructor(service: TenantsService, mapper: TenantMapper) {
        super(service, mapper);
    }
}
