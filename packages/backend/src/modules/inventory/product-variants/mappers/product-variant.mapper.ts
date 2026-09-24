import { IMapper } from 'src/common/interfaces/mapper.interface';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { ProductVariantResponseDto, ProductVariantSummaryDto } from '../dto/product-variant-response.dto';

export class ProductVariantMapper implements IMapper<ProductVariantEntity> {
    toResponseDto(entity: ProductVariantEntity): ProductVariantResponseDto {
        return {
            id: entity.id,
            quantity: entity.quantity,
            productId: entity.productId,
            specifications: entity.variants ? entity.variants.map(v => ({
                attribute: v.attributeValue?.attribute?.name ?? '',
                value: v.attributeValue?.value ?? ''
            })) : []
        } satisfies ProductVariantResponseDto;
    }

    toSummaryDto(entity: ProductVariantEntity): ProductVariantSummaryDto {
        return this.toResponseDto(entity);
    }

    toSummaryDtoList(entities: ProductVariantEntity[]): ProductVariantSummaryDto[] {
        return entities.map(entity => this.toSummaryDto(entity));
    }
}
