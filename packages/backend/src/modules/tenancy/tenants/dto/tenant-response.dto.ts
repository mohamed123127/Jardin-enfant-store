import { SubscriptionResponseDto } from "../../subscriptions/dto/subscription-response.dto";

export type TenantResponseDto = {
    id: number;
    name: string;
    slug: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    subscriptions?: SubscriptionResponseDto[];
}

export type TenantSummaryDto = {
    id: number;
    name: string;
    slug: string;
    status: string;
}
