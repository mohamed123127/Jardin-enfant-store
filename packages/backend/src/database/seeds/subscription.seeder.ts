import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import subscriptionsList from '../mock-data/subscriptions.json';
import { SubscriptionEntity } from 'src/modules/tenancy/subscriptions/entities/subscription.entity';

export class SubscriptionSeeder implements Seeder {
    async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const repo = dataSource.getRepository(SubscriptionEntity);

        for (const item of subscriptionsList) {
            await repo.save(item);
        }
    }
}