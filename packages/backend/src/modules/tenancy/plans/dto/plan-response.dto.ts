import { PlanLimitResponseDto } from "../../plan-limits/dto/plan-limit-response.dto";

export type PlanResponseDto = {
    id: number;
    name: string;
    description?: string;
    price: number;
    billingCycle: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    limits?: PlanLimitResponseDto[];
}

export type PlanSummaryDto = {
    id: number;
    name: string;
    price: number;
    billingCycle: string;
    isActive: boolean;
}
