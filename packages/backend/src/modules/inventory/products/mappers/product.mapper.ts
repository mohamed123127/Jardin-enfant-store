import { IMapper } from 'src/common/interfaces/mapper.interface';
import { ProductEntity } from '../entities/product.entity';
import { ProductResponseDto, ProductSummaryDto } from '../dto/product-response.dto';

export class ProductMapper implements IMapper<ProductEntity> {
    toResponseDto(product: ProductEntity): ProductResponseDto {
        return {
            id: product.id,
            name: product.name,
            previewImage: product.previewImage,
            barcode: product.barcode,
            description: product.description,
            sku: product.sku,
            ref: product.ref,
            costPrice: product.costPrice,
            sellingPrice: product.sellingPrice,
            discountedPrice: product.discountedPrice,
            quantity: product.quantity,
            images: product.images ? product.images.map(img => img.url) : [],
            variants: product.variants ? product.variants.map(v => ({
                id: v.id,
                quantity: v.quantity,
                specifications: v.variants ? v.variants.map(vv => ({
                    attribute: vv.attributeValue?.attribute?.name ?? '',
                    value: vv.attributeValue?.value ?? '',
                })) : [],
            })) : [],
        } satisfies ProductResponseDto;
    }

    toSummaryDto(product: ProductEntity): ProductSummaryDto {
        return {
            id: product.id,
            name: product.name,
            previewImage: product.previewImage,
            barcode: product.barcode,
            quantity: product.quantity,
            costPrice: product.costPrice,
            sellingPrice: product.sellingPrice,
            discountedPrice: product.discountedPrice,
            status: product.status,
        } satisfies ProductSummaryDto;
    }

    toSummaryDtoList(products: ProductEntity[]): ProductSummaryDto[] {
        return products.map(product => this.toSummaryDto(product));
    }
}