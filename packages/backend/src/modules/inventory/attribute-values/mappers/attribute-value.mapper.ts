import { IMapper } from 'src/common/interfaces/mapper.interface';
import { AttributeValueEntity } from '../entities/attribute-value.entity';
import { AttributeValueResponseDto, AttributeValueSummaryDto } from '../dto/attributeValues-response.dto';

export class AttributeValueMapper implements IMapper<AttributeValueEntity> {
    toResponseDto(entity: AttributeValueEntity): AttributeValueResponseDto {
        return {
            id: entity.id,
            value: entity.value,
            attributeId: entity.attributeId
        } satisfies AttributeValueResponseDto;
    }

    toSummaryDto(entity: AttributeValueEntity): AttributeValueSummaryDto {
        return {
            id: entity.id,
            value: entity.value,
            attributeId: entity.attributeId
        } satisfies AttributeValueSummaryDto;
    }

    toSummaryDtoList(entities: AttributeValueEntity[]): AttributeValueSummaryDto[] {
        return entities.map(entity => this.toSummaryDto(entity));
    }
}
