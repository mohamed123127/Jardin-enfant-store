import { Repository, DeepPartial, FindOptionsRelations, FindOptionsOrder, FindOptionsWhere, SelectQueryBuilder } from 'typeorm';
import { BadRequestException, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Filter, PaginationOptions } from '@aio/shared';
import { DeleteResult } from 'typeorm/browser';
import { StringFormatter } from 'src/common/utils/string-formatter.utils';
import { IService } from 'src/common/interfaces/IService.interface';
import { SearchField } from 'src/types/search.type';
import { ComputedFieldMap } from 'src/types/Fields.type';

export abstract class BaseCrudService<Entity extends BaseEntity, CreateDto, UpdateDto>
    implements IService<Entity, CreateDto, UpdateDto> {
    public entityName: string;
    public entityPluralName: string;
    printableEntityName(isPlural = false): string {
        return isPlural ? StringFormatter.formatEntityName(this.entityPluralName) : StringFormatter.formatEntityName(this.entityName);
    }
    public allowedSearchableFields: SearchField<Entity>[] = [];
    public allowedFilterFields: (keyof Entity)[] = [];
    public allowedOrderFields: (keyof Entity)[] = [];
    public allowedRelations: string[] = [];

    protected defaultRelations: FindOptionsRelations<Entity> = {};
    protected defaultOrder: FindOptionsOrder<Entity> = {};
    protected defaultFilter: FindOptionsWhere<Entity> = {};

    protected computedFields: ComputedFieldMap<Entity> = {};

    constructor(
        protected readonly repository: Repository<Entity>,
    ) {
        this.entityName = this.repository.metadata.name;
        this.entityPluralName = this.entityName + 's';
    }

    protected async afterValidate(entity: Entity): Promise<void> { }

    protected async validateCreate(entity: Entity): Promise<void> { }

    protected async beforSaveCreate(entity: Entity, dto: CreateDto): Promise<void> { }

    protected async validateUpdate(entity: Entity): Promise<void> { }

    async create(dto: CreateDto): Promise<Entity> {
        const entity = this.repository.create(dto as DeepPartial<Entity>);
        await this.validateCreate(entity);
        await this.afterValidate(entity);
        await this.beforSaveCreate(entity, dto);
        return this.repository.save(entity);
    }

    async findAll(
        pagination: PaginationOptions,
        order?: FindOptionsOrder<Entity>): Promise<{ data: Entity[], total: number }> {
        const [data, total] = await this.repository.findAndCount({
            where: this.defaultFilter,
            order: order || this.defaultOrder,
            relations: this.defaultRelations,
            skip: (pagination.page - 1) * pagination.limit,
            take: pagination.limit,
        });

        return {
            data,
            total
        };
    }

    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Entity> {
        const entity = await this.repository.findOne({
            where: { id } as any,
            relations: this.defaultRelations,
        });

        if (!entity) {
            throw new NotFoundException(`${this.printableEntityName()} ${id} not found`);
        }

        return entity;
    }
    async count(
        searchText?: string,
        filters?: Filter<Entity>[]): Promise<{ count: number }> {
        const qb = this.repository.createQueryBuilder('entity');

        this.applySearch(qb, searchText);

        if (filters) {
            this.applyFilters(qb, filters);
        }

        const count = await qb.getCount();

        return {
            count
        };
    }

    async search(
        searchText?: string,
        filters?: Filter<Entity>[],
        pagination?: PaginationOptions,
        order?: FindOptionsOrder<Entity>): Promise<{ data: Entity[], total: number }> {
        const qb = this.repository.createQueryBuilder('entity');

        qb.setFindOptions({
            relations: this.defaultRelations
        })

        this.applySearch(qb, searchText);

        if (filters) {
            this.applyFilters(qb, filters);
        }

        this.applyOrder(qb, order);

        this.applyPagination(qb, pagination);

        // Execute
        const [data, total] = await qb.getManyAndCount();

        return {
            data,
            total,
        };
    }

    async update(
        id: number,
        dto: UpdateDto,
    ): Promise<Entity> {
        const entity = await this.findOne(id);
        Object.assign(entity, dto);

        await this.validateUpdate(entity);

        return this.repository.save(entity);
    }

    async remove(id: number): Promise<DeleteResult> {
        return await this.repository.delete(id);
    }

    protected async countBy(where: FindOptionsWhere<Entity>): Promise<number> {
        return await this.repository.count({ where });
    }

    protected resolveColumn(key: string): string {
        const expr = this.computedFields[key as keyof Entity];
        return expr ?? `entity.${key}`;
    }

    protected applySearch(
        qb: SelectQueryBuilder<Entity>,
        searchText?: string,
    ): void {
        if (!searchText || !searchText.trim()) return;

        if (!this.allowedSearchableFields.length) {
            throw new BadRequestException(
                `Search is not enabled for entity "${this.printableEntityName()}".`
            );
        }

        const term = searchText.trim();
        const clauses = this.allowedSearchableFields
            .map(({ field, operator }, index) => {
                const column = `entity.${String(field)}`;
                const parameter = `searchTerm_${index}`;

                if (operator === 'ilike') {
                    qb.setParameter(parameter, `%${term}%`);
                    return `${column} ILIKE :${parameter}`;
                }

                qb.setParameter(parameter, term);
                return `${column} = :${parameter}`;
            })
            .join(' OR ');

        if (clauses) {
            qb.andWhere(`(${clauses})`);
        }
    }

    protected applyOrder(
        qb: SelectQueryBuilder<Entity>,
        order?: FindOptionsOrder<Entity>,
    ): void {
        if (order && Object.keys(order).length > 0) {
            for (const key of Object.keys(order)) {
                if (this.allowedOrderFields.length > 0 && !this.allowedOrderFields.includes(key as keyof Entity)) {
                    throw new BadRequestException(
                        `Order field "${key}" is not allowed for entity "${this.printableEntityName()}". Allowed order fields: [${this.allowedOrderFields.map(String).join(', ')}]`
                    );
                }
            }
        }

        const targetOrder = order || this.defaultOrder;
        if (!targetOrder) return;

        for (const [key, direction] of Object.entries(targetOrder)) {
            qb.addOrderBy(
                `entity.${key}`,
                direction === 'DESC' || direction === 'desc' ? 'DESC' : 'ASC',
            );
        }
    }

    protected applyPagination(
        qb: SelectQueryBuilder<Entity>,
        pagination?: PaginationOptions,
    ): void {
        if (!pagination) return;

        qb.skip((pagination.page - 1) * pagination.limit);
        qb.take(pagination.limit);
    }

    protected applyFilters(
        qb: SelectQueryBuilder<Entity>,
        filters?: Filter<Entity>[],
    ): void {
        if (!filters?.length) return;

        for (const [index, filter] of filters.entries()) {
            const { key, value, operator = "=" } = filter;

            if (key === "searchText") continue;

            if (!this.allowedFilterFields.includes(key as keyof Entity)) {
                throw new BadRequestException(
                    `Filter field "${String(key)}" is not allowed for entity "${this.printableEntityName()}". Allowed filter fields: [${this.allowedFilterFields.map(String).join(', ')}]`
                );
            }

            if (value === undefined || value === null || value === "") {
                continue;
            }

            const column = this.resolveColumn(String(key));
            const parameter = `filter_${String(key)}_${index}`;

            switch (operator) {
                case "=":
                    qb.andWhere(`${column} = :${parameter}`, {
                        [parameter]: value,
                    });
                    break;

                case "!=":
                    qb.andWhere(`${column} != :${parameter}`, {
                        [parameter]: value,
                    });
                    break;

                case ">":
                    qb.andWhere(`${column} > :${parameter}`, {
                        [parameter]: value,
                    });
                    break;

                case "<":
                    qb.andWhere(`${column} < :${parameter}`, {
                        [parameter]: value,
                    });
                    break;

                case ">=":
                    qb.andWhere(`${column} >= :${parameter}`, {
                        [parameter]: value,
                    });
                    break;

                case "<=":
                    qb.andWhere(`${column} <= :${parameter}`, {
                        [parameter]: value,
                    });
                    break;

                case "like":
                    qb.andWhere(`${column} LIKE :${parameter}`, {
                        [parameter]: `%${value}%`,
                    });
                    break;

                case "not like":
                    qb.andWhere(`${column} NOT LIKE :${parameter}`, {
                        [parameter]: `%${value}%`,
                    });
                    break;

                case "in": {
                    const values = String(value)
                        .split(",")
                        .map((v) => v.trim())
                        .filter(Boolean);

                    if (!values.length) break;

                    qb.andWhere(`${column} IN (:...${parameter})`, {
                        [parameter]: values,
                    });

                    break;
                }

                case "not in": {
                    const values = String(value)
                        .split(",")
                        .map((v) => v.trim())
                        .filter(Boolean);

                    if (!values.length) break;

                    qb.andWhere(`${column} NOT IN (:...${parameter})`, {
                        [parameter]: values,
                    });

                    break;
                }

                case "between": {
                    const values = String(value)
                        .split(",")
                        .map((v) => v.trim());

                    if (values.length !== 2) {
                        throw new BadRequestException(
                            `Filter "${String(key)}" with operator "between" requires 2 comma-separated values`,
                        );
                    }

                    qb.andWhere(
                        `${column} BETWEEN :${parameter}_from AND :${parameter}_to`,
                        {
                            [`${parameter}_from`]: values[0],
                            [`${parameter}_to`]: values[1],
                        },
                    );

                    break;
                }

                case "not between": {
                    const values = String(value)
                        .split(",")
                        .map((v) => v.trim());

                    if (values.length !== 2) {
                        throw new BadRequestException(
                            `Filter "${String(key)}" with operator "not between" requires 2 comma-separated values`,
                        );
                    }

                    qb.andWhere(
                        `${column} NOT BETWEEN :${parameter}_from AND :${parameter}_to`,
                        {
                            [`${parameter}_from`]: values[0],
                            [`${parameter}_to`]: values[1],
                        },
                    );

                    break;
                }

                default:
                    throw new BadRequestException(
                        `Unsupported filter operator "${operator}" for field "${String(key)}"`,
                    );
            }
        }
    }
}