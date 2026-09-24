import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AttributeValueEntity } from '../../attribute-values/entities/attribute-value.entity';
import { ProductVariantEntity } from '../../product-variants/entities/product-variant.entity';

import { Variant } from "@aio/shared";

@Entity('variants')
//to do : thing if we should add it
// @Index(['productVariantId', 'attributeValueId'], { unique: true })
export class VariantEntity extends BaseEntity implements Variant {

    @Index()
    @Column()
    productVariantId: number

    @Index()
    @Column()
    attributeValueId: number

    @ManyToOne(() => ProductVariantEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "productVariantId" })
    productVariant: ProductVariantEntity

    @ManyToOne(() => AttributeValueEntity, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "attributeValueId" })
    attributeValue: AttributeValueEntity
}
