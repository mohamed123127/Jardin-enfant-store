// src/database/factories/user.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { ProductVariantEntity } from 'src/modules/inventory/product-variants/entities/product-variant.entity';

let counter = 0;

export default setSeederFactory(ProductVariantEntity, () => {
    const productVariant = new ProductVariantEntity();

    productVariant.productId = Math.floor(counter / 15) + 1;
    productVariant.quantity = faker.number.int({ min: 0, max: 10 });

    counter++;

    return productVariant;
});

