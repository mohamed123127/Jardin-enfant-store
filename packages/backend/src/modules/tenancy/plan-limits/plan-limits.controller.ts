import { Controller } from '@nestjs/common';
import { BaseCrudController } from 'src/common/base/controllers/base-crud.controller';
import { CreatePlanLimitDto } from './dto/create-plan-limit.dto';
import { UpdatePlanLimitDto } from './dto/update-plan-limit.dto';
import { PlanLimitEntity } from './entities/plan-limit.entity';
import { PlanLimitsService } from './plan-limits.service';
import { PlanLimitMapper } from './mappers/plan-limit.mapper';

@Controller('plan-limits')
export class PlanLimitsController extends BaseCrudController(
    CreatePlanLimitDto,
    UpdatePlanLimitDto,
)<PlanLimitEntity> {
    constructor(service: PlanLimitsService, mapper: PlanLimitMapper) {
        super(service, mapper);
    }
}
