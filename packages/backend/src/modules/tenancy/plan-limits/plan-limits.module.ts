import { Module } from '@nestjs/common';
import { PlanLimitsService } from './plan-limits.service';
import { PlanLimitsController } from './plan-limits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanLimitEntity } from './entities/plan-limit.entity';
import { PlanLimitMapper } from './mappers/plan-limit.mapper';
import { PlansModule } from '../plans/plans.module';

@Module({
    imports: [TypeOrmModule.forFeature([PlanLimitEntity]), PlansModule],
    controllers: [PlanLimitsController],
    providers: [PlanLimitsService, PlanLimitMapper],
    exports: [PlanLimitsService, PlanLimitMapper],
})
export class PlanLimitsModule {}
