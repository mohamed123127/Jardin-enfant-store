import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanLimitDto } from './create-plan-limit.dto';

export class UpdatePlanLimitDto extends PartialType(CreatePlanLimitDto) {}
