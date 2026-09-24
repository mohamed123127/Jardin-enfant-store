import { BaseEntity } from "../entities/base.entity";

export interface IMapper<Entity extends BaseEntity> {
    toResponseDto(entity: Entity): any;
    toSummaryDto(entity: Entity): any;
    toSummaryDtoList(entities: Entity[]): any[];
}