import { IMapper } from 'src/common/interfaces/mapper.interface';
import { ProductImageEntity } from '../entities/product-images.entity';
import { ProductImageResponseDto, ProductImageSummaryDto } from '../dto/product-images-response.dto';

export class ProductImageMapper implements IMapper<ProductImageEntity> {
    toResponseDto(image: ProductImageEntity): ProductImageResponseDto {
        return {
            id: image.id,
            productId: image.productId,
            url: image.url,
            alt: image.alt,
            position: image.position,
        } satisfies ProductImageResponseDto;
    }

    toSummaryDto(image: ProductImageEntity): ProductImageSummaryDto {
        return {
            id: image.id,
            productId: image.productId,
            url: image.url,
            position: image.position,
        } satisfies ProductImageSummaryDto;
    }

    toSummaryDtoList(
        images: ProductImageEntity[],
    ): ProductImageSummaryDto[] {
        return images.map((image) => this.toSummaryDto(image));
    }
}