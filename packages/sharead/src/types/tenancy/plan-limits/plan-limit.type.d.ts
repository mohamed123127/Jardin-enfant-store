import { AuditableEntityShape } from "../../common";
export type PlanLimit = AuditableEntityShape & {
    planId: number;
    resource: string;
    limitValue: number;
};
