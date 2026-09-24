import { BaseEntity } from "src/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AttributeEntity } from "../../attributes/entities/attribute.entity";
import { AttributeValue } from "@aio/shared";

@Entity('attribute_values')
export class AttributeValueEntity extends BaseEntity implements AttributeValue {
    @Column()
    value: string

    @Column()
    attributeId: number

    @ManyToOne(() => AttributeEntity, (attribute) => attribute.attributeValues, { onDelete: "CASCADE" })
    @JoinColumn({ name: "attributeId" })
    attribute: AttributeEntity
}
