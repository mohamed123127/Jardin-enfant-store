import { Column, Entity, OneToMany } from "typeorm"
import { ProductVariantEntity } from '../../product-variants/entities/product-variant.entity'
import { TenantScopedEntity } from "src/common/entities/tenantScoped.entity"
import { Index } from "typeorm"

import { Product } from "@aio/shared";
import { ProductImageEntity } from "../../product-images/entities/product-images.entity";

@Entity('products')
@Index('IDX_product_tenant_barcode', ['tenantId', 'barcode'], { unique: true })
@Index('IDX_product_tenant_sku', ['tenantId', 'sku'])
@Index('IDX_product_tenant_name', ['tenantId', 'name'])
export class ProductEntity extends TenantScopedEntity implements Product {
    @Column()
    name: string

    @Column()
    previewImage: string

    @Column({ length: 9 })
    barcode: string

    @Column({ nullable: true })
    sku?: string

    @Column({ nullable: true })
    ref?: string

    @Column({ nullable: true })
    description?: string

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        default: 0
    })
    costPrice: number

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    sellingPrice: number

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
    })
    discountedPrice: number

    get quantity(): number {
        if (!this.variants) return 0;

        return this.variants.reduce(
            (total, variant) => total + variant.quantity,
            0,
        );
    }

    @Column({
        type: 'enum',
        enum: ['active', 'inactive', 'archived'],
        default: 'active'
    })
    status: 'active' | "inactive" | "archived"

    @OneToMany(() => ProductVariantEntity, (productVariant) => productVariant.product, { onDelete: 'CASCADE' })
    variants: ProductVariantEntity[]

    @OneToMany(() => ProductImageEntity, (productImage) => productImage.product, { onDelete: 'CASCADE' })
    images: ProductImageEntity[]
}