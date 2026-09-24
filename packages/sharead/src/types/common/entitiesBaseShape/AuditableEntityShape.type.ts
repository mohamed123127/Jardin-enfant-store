import { BaseEntityShape } from "./BaseEntityShape.type";

export type AuditableEntityShape = BaseEntityShape & {
    createdAt: Date;
    updatedAt: Date;
}