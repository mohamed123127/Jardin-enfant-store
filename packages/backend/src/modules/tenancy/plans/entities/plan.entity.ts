import { AuditableEntity } from "src/common/entities/auditable.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { PlanLimitEntity } from '../../plan-limits/entities/plan-limit.entity';
import { SubscriptionEntity } from '../../subscriptions/entities/subscription.entity';

import { Plan } from "@aio/shared";

@Entity('plans')
export class PlanEntity extends AuditableEntity implements Plan {
    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description?: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0.00,
    })
    price: number;

    @Column({ default: 'monthly' })
    billingCycle: string;

    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => PlanLimitEntity, (planLimit) => planLimit.plan)
    limits?: PlanLimitEntity[];

    @OneToMany(() => SubscriptionEntity, (subscription) => subscription.plan)
    subscriptions?: SubscriptionEntity[];
}
