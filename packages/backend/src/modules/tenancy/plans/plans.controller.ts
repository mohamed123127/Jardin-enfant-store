import { Controller } from '@nestjs/common';
import { BaseCrudController } from 'src/common/base/controllers/base-crud.controller';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanEntity } from './entities/plan.entity';
import { PlansService } from './plans.service';
import { PlanMapper } from './mappers/plan.mapper';

@Controller('plans')
export class PlansController extends BaseCrudController(
    CreatePlanDto,
    UpdatePlanDto,
)<PlanEntity> {
    constructor(service: PlansService, mapper: PlanMapper) {
        super(service, mapper);
    }
}
