import { AuditableEntityShape } from "./AuditableEntityShape.type";
export type TenantScopedEntityShape = AuditableEntityShape & {
    tenantId: number;
};
