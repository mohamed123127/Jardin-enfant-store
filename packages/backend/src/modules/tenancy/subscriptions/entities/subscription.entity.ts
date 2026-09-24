import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { TenantEntity } from '../../tenants/entities/tenant.entity';
import { PlanEntity } from '../../plans/entities/plan.entity';
import { TenantScopedEntity } from "src/common/entities/tenantScoped.entity";

import { Subscription } from "@aio/shared";

@Entity('subscriptions')
export class SubscriptionEntity extends TenantScopedEntity implements Subscription {
    @Column()
    planId: number;

    @Column({ default: 'active' })
    status: string;

    @Column({ type: 'timestamp' })
    startDate: Date;

    @Column({ type: 'timestamp' })
    endDate: Date;

    @ManyToOne(() => TenantEntity, (tenant) => tenant.subscriptions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'tenantId' })
    tenant?: TenantEntity;

    @ManyToOne(() => PlanEntity, (plan) => plan.subscriptions, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'planId' })
    plan?: PlanEntity;
}
