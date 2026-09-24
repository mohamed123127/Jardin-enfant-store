import { BadRequestException, NotFoundException } from "@nestjs/common";
import { BaseEntity } from "../entities/base.entity";
import { FindOptionsWhere, Repository } from "typeorm";
import { IService } from "../interfaces/IService.interface";

type FieldValue<Entity extends BaseEntity> = {
    field: keyof Entity,
    value: Entity[keyof Entity] | undefined
}

export async function assertUnique<Entity extends BaseEntity>(
    repository: Repository<Entity>,
    conditions: FieldValue<Entity>[],
    entityName: string = repository.metadata.name,
    excludeId?: number,
    isSilent: boolean = false,
): Promise<boolean> {
    // 1. Validate all fields are present
    for (const { field, value } of conditions) {
        if (value === undefined || value === null) {
            throw new BadRequestException(
                `The field ${String(field)} is required`,
            );
        }
    }

    // 2. Build combined WHERE clause
    const where = conditions.reduce((acc, { field, value }) => {
        acc[field as string] = value;
        return acc;
    }, {} as FindOptionsWhere<Entity>);

    // 3. Check uniqueness
    const exists = await repository.findOne({ where });

    if (exists && exists.id !== excludeId) {
        if (isSilent) {
            return false;
        }
        const conflictFields = conditions
            .map(({ field, value }) => `${String(field)}: ${value}`)
            .join(', ');

        throw new BadRequestException(
            `${entityName} already exists with ${conflictFields}`,
        );
    }
    return true;
}

export async function assertExists<Entity extends BaseEntity>(
    service: IService<Entity, any, any>,
    id: number,
    entityName: string,
): Promise<Entity> {
    const entity = await service.findOne(id);

    if (!entity) {
        throw new NotFoundException(`${entityName} with id ${id} not found`);
    }

    return entity;
}