import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { VariantEntity } from 'src/modules/inventory/variants/entities/variant.entity';

export class VariantSeeder implements Seeder {
    async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const variantFactory = factoryManager.get(VariantEntity);
        await variantFactory.saveMany(7500 * 2);
    }
}