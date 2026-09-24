import { TenantScopedEntityShape } from "../../common";
export type Subscription = TenantScopedEntityShape & {
    planId: number;
    status: string;
    startDate: Date;
    endDate: Date;
};
