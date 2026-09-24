import { VariantEntity } from 'src/modules/inventory/variants/entities/variant.entity';
import { setSeederFactory } from 'typeorm-extension';

let counter = 0;

export default setSeederFactory(VariantEntity, () => {
    const variant = new VariantEntity();

    const productVariantId = Math.floor(counter / 2) + 1;

    // 0..14 inside each product
    const indexInsideProduct =
        (productVariantId - 1) % 15;

    // true => color
    const isColor = counter % 2 === 0;

    variant.productVariantId = productVariantId;

    if (isColor) {
        // Colors 1..3
        variant.attributeValueId =
            Math.floor(indexInsideProduct / 5) + 1;
    } else {
        // Sizes 12..16
        variant.attributeValueId =
            (indexInsideProduct % 5) + 12;
    }

    counter++;

    return variant;
});