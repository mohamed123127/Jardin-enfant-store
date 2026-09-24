import { Module } from '@nestjs/common';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './entities/plan.entity';
import { PlanMapper } from './mappers/plan.mapper';

@Module({
    imports: [TypeOrmModule.forFeature([PlanEntity])],
    controllers: [PlansController],
    providers: [PlansService, PlanMapper],
    exports: [PlansService, PlanMapper],
})
export class PlansModule {}
