import { faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { ProductEntity } from 'src/modules/inventory/products/entities/product.entity';

export default setSeederFactory(ProductEntity, () => {
    const fakeProduct = new ProductEntity();
    const costPrice = faker.number.float({
        min: 500,
        max: 100000,
        fractionDigits: 2,
    });

    const margin = faker.number.float({
        min: 1.2,
        max: 2.5,
        fractionDigits: 2,
    });

    fakeProduct.name = faker.commerce.productName();
    fakeProduct.barcode = faker.string.numeric(9);

    fakeProduct.sku = faker.string.alphanumeric({
        length: 10,
        casing: 'upper',
    });

    fakeProduct.ref = faker.string.alphanumeric({
        length: 8,
        casing: 'upper',
    });

    fakeProduct.description = faker.commerce.productDescription();

    fakeProduct.costPrice = costPrice;

    fakeProduct.sellingPrice = Number((costPrice * margin).toFixed(2));

    fakeProduct.tenantId = faker.number.int({ min: 1, max: 10 })

    return fakeProduct
});