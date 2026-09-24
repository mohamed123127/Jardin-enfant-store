import { IMapper } from 'src/common/interfaces/mapper.interface';
import { BusinessTypeEntity } from '../entities/business-type.entity';

export type BusinessTypeSummaryDto = {
    id: number;
    name: string;
    description?: string;
};

export type BusinessTypeResponseDto = {
    id: number;
    name: string;
    description?: string;
    categories?: { id: number; name: string }[];
    attributes?: { id: number; name: string }[];
    tenants?: { id: number; name: string }[];
};

export class BusinessTypeMapper implements IMapper<BusinessTypeEntity> {
    toResponseDto(entity: BusinessTypeEntity): BusinessTypeResponseDto {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            categories: entity.categories?.map(c => ({ id: c.id, name: c.name })) ?? [],
            attributes: entity.attributes?.map(a => ({ id: a.id, name: a.name })) ?? [],
            tenants: entity.tenants?.map(t => ({ id: t.id, name: t.name })) ?? [],
        };
    }

    toSummaryDto(entity: BusinessTypeEntity): BusinessTypeSummaryDto {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
        };
    }

    toSummaryDtoList(entities: BusinessTypeEntity[]): BusinessTypeSummaryDto[] {
        return entities.map(e => this.toSummaryDto(e));
    }
}
