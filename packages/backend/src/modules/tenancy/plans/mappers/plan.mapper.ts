import { IMapper } from 'src/common/interfaces/mapper.interface';
import { PlanEntity } from '../entities/plan.entity';
import { PlanResponseDto, PlanSummaryDto } from '../dto/plan-response.dto';

export class PlanMapper implements IMapper<PlanEntity> {
    toResponseDto(entity: PlanEntity): PlanResponseDto {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            price: Number(entity.price),
            billingCycle: entity.billingCycle,
            isActive: entity.isActive,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            limits: entity.limits ? entity.limits.map(l => ({
                id: l.id,
                planId: l.planId,
                resource: l.resource,
                limitValue: l.limitValue,
                createdAt: l.createdAt,
                updatedAt: l.updatedAt,
            })) : []
        } satisfies PlanResponseDto;
    }

    toSummaryDto(entity: PlanEntity): PlanSummaryDto {
        return {
            id: entity.id,
            name: entity.name,
            price: Number(entity.price),
            billingCycle: entity.billingCycle,
            isActive: entity.isActive,
        } satisfies PlanSummaryDto;
    }

    toSummaryDtoList(entities: PlanEntity[]): PlanSummaryDto[] {
        return entities.map(entity => this.toSummaryDto(entity));
    }
}
