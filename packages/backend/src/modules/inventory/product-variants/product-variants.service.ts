import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from 'src/common/base/services/base-crud.service';
import { ProductVariantEntity } from './entities/product-variant.entity';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductsService } from '../products/products.service';
import { assertExists } from 'src/common/utils/dataBase-validation.util';

@Injectable()
export class ProductVariantsService extends BaseCrudService<ProductVariantEntity, CreateProductVariantDto, UpdateProductVariantDto> {
    constructor(
        @InjectRepository(ProductVariantEntity) repo: Repository<ProductVariantEntity>,
        private readonly productsService: ProductsService
    ) {
        super(repo);
        this.entityPluralName = "ProductVariants";
        this.defaultRelations = {
            variants: {
                attributeValue: {
                    attribute: true
                }
            }
        };
    }

    override async validateCreate(entity: ProductVariantEntity) {
        await assertExists(this.productsService, entity.productId, "Product");
    }

    protected override async validateUpdate(entity: ProductVariantEntity): Promise<void> {
        await assertExists(this.productsService, entity.productId, "Product");
    }

    /**
     * Atomically decreases the stock quantity of a variant to prevent race conditions.
     */
    async decreaseQuantity(id: number, quantityToDecrease: number): Promise<ProductVariantEntity> {
        if (quantityToDecrease <= 0) {
            throw new BadRequestException('Quantity to decrease must be greater than 0');
        }

        const amount = Number(quantityToDecrease);

        // Atomic update query at DB level: prevents race conditions and overselling
        const updateResult = await this.repository
            .createQueryBuilder()
            .update(ProductVariantEntity)
            .set({
                quantity: () => `quantity - ${amount}`
            })
            .where("id = :id AND quantity >= :amount", { id, amount })
            .execute();

        if (updateResult.affected === 0) {
            const variant = await this.repository.findOne({ where: { id } as any });
            if (!variant) {
                throw new NotFoundException(`Product variant ${id} not found`);
            }
            throw new BadRequestException(
                `Cannot decrease quantity by ${amount}. Insufficient stock (Available: ${variant.quantity}).`
            );
        }

        return await this.findOne(id);
    }
}
