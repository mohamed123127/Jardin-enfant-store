import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { AttributeEntity } from 'src/modules/inventory/attributes/entities/attribute.entity';
import attributeList from '../mock-data/attributes.json';

export class AttributeSeeder implements Seeder {
    async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const attributeFactory = factoryManager.get(AttributeEntity);
        for (const name of attributeList) {
            await attributeFactory.save({ name });
        }
    }
}