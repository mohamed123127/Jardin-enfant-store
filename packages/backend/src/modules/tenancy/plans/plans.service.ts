import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from 'src/common/base/services/base-crud.service';
import { PlanEntity } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { assertUnique } from 'src/common/utils/dataBase-validation.util';

@Injectable()
export class PlansService extends BaseCrudService<PlanEntity, CreatePlanDto, UpdatePlanDto> {
    constructor(@InjectRepository(PlanEntity) repo: Repository<PlanEntity>) {
        super(repo);
        this.defaultRelations = { limits: true };
    }

    protected override async validateCreate(entity: PlanEntity): Promise<void> {
        await assertUnique(this.repository, [{ field: 'name', value: entity.name }], this.printableEntityName());
    }

    protected override async validateUpdate(entity: PlanEntity): Promise<void> {
        await assertUnique(this.repository, [{ field: 'name', value: entity.name }], this.printableEntityName());
    }
}
