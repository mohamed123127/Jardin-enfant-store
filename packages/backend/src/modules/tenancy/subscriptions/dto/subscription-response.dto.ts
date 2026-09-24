import { PlanSummaryDto } from "../../plans/dto/plan-response.dto";
import { TenantSummaryDto } from "../../tenants/dto/tenant-response.dto";

export type SubscriptionResponseDto = {
    id: number;
    tenantId: number;
    planId: number;
    status: string;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    tenant?: TenantSummaryDto;
    plan?: PlanSummaryDto;
}

export type SubscriptionSummaryDto = SubscriptionResponseDto;
