import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { TenantEntity } from 'src/modules/tenancy/tenants/entities/tenant.entity';

export class TenantSeeder implements Seeder {
    async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const tenantFactory = factoryManager.get(TenantEntity);

        await tenantFactory.saveMany(1);
    }
}