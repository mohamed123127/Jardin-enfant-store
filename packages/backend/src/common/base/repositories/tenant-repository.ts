// tenant-base.repository.ts
import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { TenantScopedEntity } from 'src/common/entities/tenantScoped.entity';
import { TenantEntity } from 'src/modules/tenancy/tenants/entities/tenant.entity';
import {
    Repository,
    FindOptionsWhere,
    UpdateResult,
    InsertResult,
    DeleteResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class TenantRepository<T extends TenantScopedEntity> extends Repository<T> {
    constructor(
        target: any,
        manager: any,
        private readonly cls: ClsService,
    ) {
        super(target, manager);
    }

    private get tenantId(): string {
        // const id = this.cls.get('tenantId');
        // if (!id) {
        //     // fail loudly — silently omitting tenantId is how cross-tenant leaks happen
        //     throw new Error('tenantId not found in CLS context');
        // }
        return '1';
    }

    /** Merges tenantId into a where clause, handling undefined/object/array cases. */
    private scopeWhere(
        where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    ): FindOptionsWhere<T> | FindOptionsWhere<T>[] {
        const tenantId = this.tenantId;
        if (Array.isArray(where)) {
            return where.map((w) => ({ ...w, tenantId }));
        }
        return { ...(where ?? {}), tenantId } as FindOptionsWhere<T>;
    }

    /** Strips tenantId from a payload so callers can't reassign an entity to another tenant. */
    private stripTenantId<P extends object>(payload: P): P {
        const { tenantId, ...rest } = payload as any;
        return rest;
    }

    // ---------- reads ----------

    override find(options: any = {}) {
        return super.find({ ...options, where: this.scopeWhere(options.where) });
    }

    override findBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
        return super.findBy(this.scopeWhere(where) as any);
    }

    override findOne(options: any) {
        return super.findOne({ ...options, where: this.scopeWhere(options.where) });
    }

    override findOneBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
        return super.findOneBy(this.scopeWhere(where) as any);
    }

    override findAndCount(options: any = {}) {
        return super.findAndCount({ ...options, where: this.scopeWhere(options.where) });
    }

    override countBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
        return super.countBy(this.scopeWhere(where) as any);
    }

    override findOneOrFail(options: any) {
        return super.findOneOrFail({ ...options, where: this.scopeWhere(options.where) });
    }

    override findOneByOrFail(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
        return super.findOneByOrFail(this.scopeWhere(where) as any);
    }

    // ---------- writes ----------

    /** create() just builds instances in memory — inject tenantId so it's set before save(). */
    override create(entityLike?: any): any {
        const tenantId = this.tenantId;
        if (Array.isArray(entityLike)) {
            return super.create(entityLike.map((e) => ({ ...e, tenantId })));
        }
        return super.create({ ...(entityLike ?? {}), tenantId });
    }

    /** save() covers both insert and update — always force the current tenantId. */
    override save(entityOrEntities: any, options?: any): any {
        const tenantId = this.tenantId;
        if (Array.isArray(entityOrEntities)) {
            const scoped = entityOrEntities.map((e) => ({ ...e, tenantId }));
            return super.save(scoped as any, options);
        }
        return super.save({ ...entityOrEntities, tenantId } as any, options);
    }

    /** insert() bypasses save() hooks/entity building, so scope it separately. */
    override insert(entity: any): Promise<InsertResult> {
        const tenantId = this.tenantId;
        const scoped = Array.isArray(entity)
            ? entity.map((e) => ({ ...e, tenantId }))
            : { ...entity, tenantId };
        return super.insert(scoped as any);
    }

    /**
     * update() takes (criteria, partialEntity). Scope the criteria to the tenant
     * AND strip tenantId out of the payload so it can't be changed via update.
     */
    override update(
        criteria: any,
        partialEntity: QueryDeepPartialEntity<T>,
    ): Promise<UpdateResult> {
        const safePayload = this.stripTenantId(partialEntity as object);
        const scopedCriteria = this.scopeCriteria(criteria);
        return super.update(scopedCriteria, safePayload as any);
    }

    override delete(criteria: any): Promise<DeleteResult> {
        return super.delete(this.scopeCriteria(criteria));
    }

    override softDelete(criteria: any): Promise<UpdateResult> {
        return super.softDelete(this.scopeCriteria(criteria));
    }

    override createQueryBuilder(alias: string, queryRunner?: any) {
        return super
            .createQueryBuilder(alias, queryRunner)
            .andWhere(`${alias}.tenantId = :tenantId`, {
                tenantId: this.tenantId,
            });
    }

    /**
     * update/delete criteria can be an id, array of ids, or a FindOptionsWhere.
     * Only the where-object case can safely be merged with tenantId; id-based
     * criteria need converting so we don't accidentally match wrong rows.
     */
    private scopeCriteria(criteria: any) {
        const tenantId = this.tenantId;
        if (criteria === null || criteria === undefined) {
            throw new Error('Refusing update/delete with empty criteria');
        }
        // id or array of ids
        if (
            typeof criteria === 'string' ||
            typeof criteria === 'number' ||
            Array.isArray(criteria)
        ) {
            return { id: criteria, tenantId } as any;
        }
        // FindOptionsWhere object
        return this.scopeWhere(criteria);
    }
}