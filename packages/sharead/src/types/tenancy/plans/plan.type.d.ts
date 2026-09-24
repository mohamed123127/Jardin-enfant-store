import { AuditableEntityShape } from "../../common";
export type Plan = AuditableEntityShape & {
    name: string;
    description?: string;
    price: number;
    billingCycle: string;
    isActive: boolean;
};
