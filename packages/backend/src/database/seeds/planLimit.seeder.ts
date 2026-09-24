import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import planLimitsList from '../mock-data/plan-limits.json';
import { PlanLimitEntity } from 'src/modules/tenancy/plan-limits/entities/plan-limit.entity';

export class PlanLimitSeeder implements Seeder {
    async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const repo = dataSource.getRepository(PlanLimitEntity);

        for (const item of planLimitsList) {
            await repo.save(item);
        }
    }
}