import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";
import { TenantEntity } from "src/modules/tenancy/tenants/entities/tenant.entity";
import { CategoryEntity } from "src/modules/inventory/categories/entities/category.entity";
import { AttributeEntity } from "src/modules/inventory/attributes/entities/attribute.entity";
import { BusinessType } from "@aio/shared";

@Entity('business_types')
export class BusinessTypeEntity extends BaseEntity implements BusinessType {
    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description?: string;

    @OneToMany(() => TenantEntity, (tenant) => tenant.businessType)
    tenants?: TenantEntity[];

    @ManyToMany(() => CategoryEntity, (category) => category.businessTypes)
    @JoinTable({ name: 'business_type_categories' })
    categories?: CategoryEntity[];

    @ManyToMany(() => AttributeEntity, (attribute) => attribute.businessTypes)
    @JoinTable({ name: 'business_type_attributes' })
    attributes?: AttributeEntity[];
}
