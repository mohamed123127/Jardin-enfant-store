import { AuditableEntity } from "src/common/entities/auditable.entity";
import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { PlanEntity } from '../../plans/entities/plan.entity';

import { PlanLimit } from "@aio/shared";

@Entity('plan_limits')
export class PlanLimitEntity extends AuditableEntity implements PlanLimit {
    @Column()
    planId: number;

    @Column()
    resource: string;

    @Column()
    limitValue: number;

    @ManyToOne(() => PlanEntity, (plan) => plan.limits, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'planId' })
    plan?: PlanEntity;
}
