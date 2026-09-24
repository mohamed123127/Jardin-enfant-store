import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from 'src/common/base/services/base-crud.service';
import { PlanLimitEntity } from './entities/plan-limit.entity';
import { CreatePlanLimitDto } from './dto/create-plan-limit.dto';
import { UpdatePlanLimitDto } from './dto/update-plan-limit.dto';
import { PlansService } from '../plans/plans.service';
import { assertExists, assertUnique } from 'src/common/utils/dataBase-validation.util';

@Injectable()
export class PlanLimitsService extends BaseCrudService<PlanLimitEntity, CreatePlanLimitDto, UpdatePlanLimitDto> {
    constructor(
        @InjectRepository(PlanLimitEntity) repo: Repository<PlanLimitEntity>,
        private readonly plansService: PlansService,
    ) {
        super(repo);
    }

    protected override async validateCreate(entity: PlanLimitEntity): Promise<void> {
        await assertExists(this.plansService, entity.planId, 'Plan');
        await assertUnique(this.repository, [
            { field: 'planId', value: entity.planId },
            { field: 'resource', value: entity.resource }
        ], this.printableEntityName());
    }

    protected override async validateUpdate(entity: PlanLimitEntity): Promise<void> {
        await assertExists(this.plansService, entity.planId, 'Plan');
        await assertUnique(this.repository, [
            { field: 'planId', value: entity.planId },
            { field: 'resource', value: entity.resource }
        ], this.printableEntityName(), entity.id);
    }
}
