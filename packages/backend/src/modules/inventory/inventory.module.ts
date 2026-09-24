import { Module } from "@nestjs/common";
import { AttributesModule } from "./attributes/attributes.module";
import { AttributeValuesModule } from "./attribute-values/attribute-values.module";
import { VariantsModule } from "./variants/variants.module";
import { ProductVariantsModule } from "./product-variants/product-variants.module";
import { ProductsModule } from "./products/products.module";
import { CategoriesModule } from "./categories/categories.module";
import { ProductImagesModule } from "./product-images/products-images.module";

@Module({
    imports: [AttributesModule, AttributeValuesModule, VariantsModule, ProductVariantsModule, ProductsModule, CategoriesModule, ProductImagesModule],
})
export class InventoryModule { }