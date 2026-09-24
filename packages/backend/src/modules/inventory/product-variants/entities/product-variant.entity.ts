import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { ProductEntity } from '../../products/entities/product.entity';
import { VariantEntity } from '../../variants/entities/variant.entity';
import { ProductVariant } from "@aio/shared";

@Entity('product_variants')
export class ProductVariantEntity extends BaseEntity implements ProductVariant {
    @Column()
    quantity: number

    @Index()
    @Column()
    productId: number

    @ManyToOne(() => ProductEntity, (product) => product.variants, { onDelete: "CASCADE" })
    @JoinColumn({ name: "productId" })
    product: ProductEntity

    @OneToMany(() => VariantEntity, (variant) => variant.productVariant, { onDelete: "CASCADE" })
    variants: VariantEntity[]
}

