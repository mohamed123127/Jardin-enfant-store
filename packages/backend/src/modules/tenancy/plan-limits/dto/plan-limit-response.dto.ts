export type PlanLimitResponseDto = {
    id: number;
    planId: number;
    resource: string;
    limitValue: number;
    createdAt: Date;
    updatedAt: Date;
}

export type PlanLimitSummaryDto = PlanLimitResponseDto;
