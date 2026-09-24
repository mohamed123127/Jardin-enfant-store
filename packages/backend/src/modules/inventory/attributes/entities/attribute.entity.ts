import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { AttributeValueEntity } from '../../attribute-values/entities/attribute-value.entity';
import { Attribute } from "@aio/shared";
import { BusinessTypeEntity } from "src/modules/tenancy/business-types/entities/business-type.entity";

@Entity('attributes')
export class AttributeEntity extends BaseEntity implements Attribute {
    @Column({ unique: true })
    name: string

    @OneToMany(() => AttributeValueEntity, (attributeValue) => attributeValue.attribute)
    attributeValues: AttributeValueEntity[]

    @ManyToMany(() => BusinessTypeEntity, (bt) => bt.attributes)
    businessTypes?: BusinessTypeEntity[];
}
