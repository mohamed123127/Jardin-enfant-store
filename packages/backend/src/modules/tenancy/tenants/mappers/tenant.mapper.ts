import { IMapper } from 'src/common/interfaces/mapper.interface';
import { TenantEntity } from '../entities/tenant.entity';
import { TenantResponseDto, TenantSummaryDto } from '../dto/tenant-response.dto';

export class TenantMapper implements IMapper<TenantEntity> {
    toResponseDto(entity: TenantEntity): TenantResponseDto {
        return {
            id: entity.id,
            name: entity.name,
            slug: entity.slug,
            status: entity.status,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            subscriptions: entity.subscriptions ? entity.subscriptions.map(s => ({
                id: s.id,
                tenantId: s.tenantId,
                planId: s.planId,
                status: s.status,
                startDate: s.startDate,
                endDate: s.endDate,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
            })) : []
        } satisfies TenantResponseDto;
    }

    toSummaryDto(entity: TenantEntity): TenantSummaryDto {
        return {
            id: entity.id,
            name: entity.name,
            slug: entity.slug,
            status: entity.status,
        } satisfies TenantSummaryDto;
    }

    toSummaryDtoList(entities: TenantEntity[]): TenantSummaryDto[] {
        return entities.map(entity => this.toSummaryDto(entity));
    }
}
