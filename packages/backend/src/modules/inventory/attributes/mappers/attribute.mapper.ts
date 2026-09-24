import { IMapper } from 'src/common/interfaces/mapper.interface';
import { AttributeEntity } from '../entities/attribute.entity';
import { AttributeResponseDto, AttributeSummaryDto } from '@aio/shared';

export class AttributeMapper implements IMapper<AttributeEntity> {
    toResponseDto(entity: AttributeEntity): AttributeResponseDto {
        const mappedValues = entity.attributeValues ? entity.attributeValues.map(v => ({
            id: v.id,
            value: v.value,
        })) : [];

        return {
            id: entity.id,
            name: entity.name,
            values: mappedValues,
        } satisfies AttributeResponseDto;
    }

    toSummaryDto(entity: AttributeEntity): AttributeSummaryDto {
        return {
            id: entity.id,
            name: entity.name,
            values: entity.attributeValues ? entity.attributeValues.map(v => ({
                id: v.id,
                value: v.value,
            })) : [],
        } satisfies AttributeSummaryDto;
    }

    toSummaryDtoList(entities: AttributeEntity[]): AttributeSummaryDto[] {
        return entities.map(entity => this.toSummaryDto(entity));
    }
}
