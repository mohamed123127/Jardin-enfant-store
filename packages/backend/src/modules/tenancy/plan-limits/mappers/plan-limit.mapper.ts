import { IMapper } from 'src/common/interfaces/mapper.interface';
import { PlanLimitEntity } from '../entities/plan-limit.entity';
import { PlanLimitResponseDto, PlanLimitSummaryDto } from '../dto/plan-limit-response.dto';

export class PlanLimitMapper implements IMapper<PlanLimitEntity> {
    toResponseDto(entity: PlanLimitEntity): PlanLimitResponseDto {
        return {
            id: entity.id,
            planId: entity.planId,
            resource: entity.resource,
            limitValue: entity.limitValue,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        } satisfies PlanLimitResponseDto;
    }

    toSummaryDto(entity: PlanLimitEntity): PlanLimitSummaryDto {
        return this.toResponseDto(entity);
    }

    toSummaryDtoList(entities: PlanLimitEntity[]): PlanLimitSummaryDto[] {
        return entities.map(entity => this.toSummaryDto(entity));
    }
}
