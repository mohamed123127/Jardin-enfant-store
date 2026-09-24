// inventory/product-images/entities/product-image.entity.ts

import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
} from 'typeorm';

import { TenantScopedEntity } from 'src/common/entities/tenantScoped.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('product_images')
@Index('IDX_product_image_tenant_product', ['tenantId', 'productId'])
export class ProductImageEntity extends TenantScopedEntity {

    @Column()
    productId: string;

    @Column()
    url: string;

    @Column({ nullable: true })
    alt?: string;

    @Column({ default: 0 })
    position: number;

    @ManyToOne(
        () => ProductEntity,
        (product) => product.images,
        { onDelete: 'CASCADE' },
    )
    @JoinColumn({ name: 'productId' })
    product: ProductEntity;
}