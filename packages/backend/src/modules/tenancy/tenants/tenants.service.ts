import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from 'src/common/base/services/base-crud.service';
import { TenantEntity } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { assertUnique } from 'src/common/utils/dataBase-validation.util';

@Injectable()
export class TenantsService extends BaseCrudService<TenantEntity, CreateTenantDto, UpdateTenantDto> {
    constructor(@InjectRepository(TenantEntity) repo: Repository<TenantEntity>) {
        super(repo);
        this.defaultRelations = { subscriptions: true };
    }

    protected override async validateCreate(entity: TenantEntity): Promise<void> {
        await assertUnique(this.repository, [{ field: 'slug', value: entity.slug }], this.printableEntityName());
    }

    protected override async validateUpdate(entity: TenantEntity): Promise<void> {
        await assertUnique(this.repository, [{ field: 'slug', value: entity.slug }], this.printableEntityName());
    }
}
