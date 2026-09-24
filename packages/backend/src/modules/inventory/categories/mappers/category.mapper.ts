import { CategoryEntity } from '../entities/category.entity';
import { CategoryResponseDto, CategorySummaryDto } from '../dto/category-response.dto';
import { IMapper } from 'src/common/interfaces/mapper.interface';

export class CategoryMapper implements IMapper<CategoryEntity> {
    toResponseDto(entity: CategoryEntity): CategoryResponseDto {
        return {
            id: entity.id,
            name: entity.name
        } satisfies CategoryResponseDto
    }

    toSummaryDto(entity: CategoryEntity): CategorySummaryDto {
        return {
            id: entity.id,
            name: entity.name
        } satisfies CategorySummaryDto
    }

    toSummaryDtoList(entities: CategoryEntity[]): CategorySummaryDto[] {
        return entities.map(entity => this.toSummaryDto(entity)) satisfies CategorySummaryDto[]
    }
}