import { BaseEntity } from "./base.entity";
import { CreateDateColumn, UpdateDateColumn } from "typeorm";
import { AuditableEntityShape } from "@aio/shared";

export class AuditableEntity extends BaseEntity implements AuditableEntityShape {
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}