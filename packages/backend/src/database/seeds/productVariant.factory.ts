import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { AttributeEntity } from 'src/modules/inventory/attributes/entities/attribute.entity';
import attributeList from '../mock-data/attributes.json';
import { ProductVariantEntity } from 'src/modules/inventory/product-variants/entities/product-variant.entity';

export class ProductVariantSeeder implements Seeder {
    async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        const variantFactory = factoryManager.get(ProductVariantEntity);
        await variantFactory.saveMany(500 * 15);
    }
}