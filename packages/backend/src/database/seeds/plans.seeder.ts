import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { PlanEntity } from 'src/modules/tenancy/plans/entities/plan.entity';
import plansList from '../mock-data/plans.json';

export class PlanSeeder implements Seeder {
    async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const repo = dataSource.getRepository(PlanEntity);

        for (const item of plansList) {
            await repo.save(item);
        }
    }
}