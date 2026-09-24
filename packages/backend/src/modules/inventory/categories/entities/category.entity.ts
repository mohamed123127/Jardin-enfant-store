import { Column, Entity, ManyToMany } from "typeorm"
import { BaseEntity } from "src/common/entities/base.entity"
import { Category } from "@aio/shared";
import { BusinessTypeEntity } from "src/modules/tenancy/business-types/entities/business-type.entity";

@Entity('categories')
export class CategoryEntity extends BaseEntity implements Category {
    @Column()
    name: string

    @ManyToMany(() => BusinessTypeEntity, (bt) => bt.categories)
    businessTypes?: BusinessTypeEntity[];
}