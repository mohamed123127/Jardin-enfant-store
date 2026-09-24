import { DeleteResult, FindOptionsOrder, FindOptionsRelations, FindOptionsWhere } from "typeorm";
import { BaseEntity } from "../entities/base.entity";
import { Filter, PaginationOptions } from "@aio/shared";
import { SearchField } from "src/types/search.type";

export interface IService<Entity extends BaseEntity, CreateDto, UpdateDto> {
    entityName: string;
    entityPluralName: string;
    allowedSearchableFields: SearchField<Entity>[];
    allowedFilterFields: (keyof Entity)[];
    allowedOrderFields: (keyof Entity)[];
    allowedRelations: string[];


    printableEntityName(isPlural?: boolean): string;

    findOne(id: number): Promise<Entity>;
    findAll(
        pagination: PaginationOptions,
        order?: FindOptionsOrder<Entity>,
        where?: FindOptionsWhere<Entity>): Promise<{ data: Entity[], total: number }>;
    search(searchText?: string,
        filters?: Filter<Entity>[],
        pagination?: PaginationOptions,
        order?: FindOptionsOrder<Entity>): Promise<{ data: Entity[], total: number }>;
    count(searchText?: string,
        filters?: Filter<Entity>[]): Promise<{ count: number }>;
    create(createDto: CreateDto): Promise<Entity>;
    update(id: number, updateDto: UpdateDto): Promise<Entity>;
    remove(id: number): Promise<DeleteResult>;
}