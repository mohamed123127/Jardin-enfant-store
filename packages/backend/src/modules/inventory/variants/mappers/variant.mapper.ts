import { IMapper } from 'src/common/interfaces/mapper.interface';
import { VariantEntity } from '../entities/variant.entity';

export type VariantEntityResponseDto = {
    id: number;
    productVariantId: number;
    attributeValueId: number;
}

export class VariantMapper implements IMapper<VariantEntity> {
    toResponseDto(entity: VariantEntity): VariantEntityResponseDto {
        return {
            id: entity.id,
            productVariantId: entity.productVariantId,
            attributeValueId: entity.attributeValueId
        } satisfies VariantEntityResponseDto;
    }

    toSummaryDto(entity: VariantEntity): VariantEntityResponseDto {
        return this.toSummaryDto(entity);
    }

    toSummaryDtoList(entities: VariantEntity[]): VariantEntityResponseDto[] {
        return entities.map(entity => this.toResponseDto(entity));
    }
}
