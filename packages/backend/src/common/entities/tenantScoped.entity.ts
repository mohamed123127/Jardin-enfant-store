import { Column, Index } from "typeorm";
import { AuditableEntity } from "./auditable.entity";
import { TenantScopedEntityShape } from "@aio/shared";

export abstract class TenantScopedEntity extends AuditableEntity implements TenantScopedEntityShape {
    @Index()
    @Column()
    tenantId: number;
}