// tenant-repository.provider.ts
import { Provider } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import { getTenantRepositoryToken } from '../utils/tenant-repository-tokenization.token';
import { TenantRepository } from '../base/repositories/tenant-repository';

export function createTenantRepositoryProvider(entity: Function): Provider {
    return {
        provide: getTenantRepositoryToken(entity),
        useFactory: (dataSource: DataSource, cls: ClsService) =>
            new TenantRepository(entity, dataSource.manager, cls),
        inject: [DataSource, ClsService],
    };
}