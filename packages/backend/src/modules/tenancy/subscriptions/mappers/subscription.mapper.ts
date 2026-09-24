import { IMapper } from 'src/common/interfaces/mapper.interface';
import { SubscriptionEntity } from '../entities/subscription.entity';
import { SubscriptionResponseDto, SubscriptionSummaryDto } from '../dto/subscription-response.dto';

export class SubscriptionMapper implements IMapper<SubscriptionEntity> {
    toResponseDto(entity: SubscriptionEntity): SubscriptionResponseDto {
        return {
            id: entity.id,
            tenantId: entity.tenantId,
            planId: entity.planId,
            status: entity.status,
            startDate: entity.startDate,
            endDate: entity.endDate,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            tenant: entity.tenant ? {
                id: entity.tenant.id,
                name: entity.tenant.name,
                slug: entity.tenant.slug,
                status: entity.tenant.status,
            } : undefined,
            plan: entity.plan ? {
                id: entity.plan.id,
                name: entity.plan.name,
                price: Number(entity.plan.price),
                billingCycle: entity.plan.billingCycle,
                isActive: entity.plan.isActive,
            } : undefined,
        } satisfies SubscriptionResponseDto;
    }

    toSummaryDto(entity: SubscriptionEntity): SubscriptionSummaryDto {
        return this.toResponseDto(entity);
    }

    toSummaryDtoList(entities: SubscriptionEntity[]): SubscriptionSummaryDto[] {
        return entities.map(entity => this.toSummaryDto(entity));
    }
}
