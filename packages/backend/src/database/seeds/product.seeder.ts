import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { ProductEntity } from 'src/modules/inventory/products/entities/product.entity';
import productsList from '../mock-data/products.json';
import { faker } from '@faker-js/faker';


export class ProductSeeder implements Seeder {
    async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        //save Real products
        await saveRealProducts(dataSource)


        // save fake data
        // const productFactory = factoryManager.get(ProductEntity);
        // await productFactory.saveMany(1000);
    }
}

async function saveRealProducts(dataSource: DataSource) {
    const productRepo = dataSource.getRepository(ProductEntity);

    for (const item of productsList) {
        await productRepo.save({
            name: item.name,
            description: item.description,
            costPrice: item.costPrice,
            sellingPrice: item.sellingPrice,

            barcode: faker.string.numeric(9),
            sku: faker.string.alphanumeric({
                length: 10,
                casing: 'upper',
            }),
            ref: faker.string.alphanumeric({
                length: 8,
                casing: 'upper',
            }),
            tenantId: faker.number.int({ min: 1, max: 10 })

        });
    }
}