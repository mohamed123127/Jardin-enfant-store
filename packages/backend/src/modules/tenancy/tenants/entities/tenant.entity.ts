import { AuditableEntity } from "src/common/entities/auditable.entity";
import { Column, Entity, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { SubscriptionEntity } from '../../subscriptions/entities/subscription.entity';
import { Tenant } from "@aio/shared";
import { BusinessTypeEntity } from "../../business-types/entities/business-type.entity";

@Entity('tenants')
export class TenantEntity extends AuditableEntity implements Tenant {
    @Column()
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column({ default: 'active' })
    status: string;

    @Column({ nullable: true })
    businessTypeId?: number;

    @ManyToOne(() => BusinessTypeEntity, (bt) => bt.tenants, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'businessTypeId' })
    businessType?: BusinessTypeEntity;

    @OneToMany(() => SubscriptionEntity, (subscription) => subscription.tenant)
    subscriptions?: SubscriptionEntity[];
}
