import { Controller, UseGuards } from '@nestjs/common';
import { BaseCrudController } from 'src/common/base/controllers/base-crud.controller';
import { CreateBusinessTypeDto } from './dto/create-business-type.dto';
import { UpdateBusinessTypeDto } from './dto/update-business-type.dto';
import { BusinessTypeEntity } from './entities/business-type.entity';
import { BusinessTypeService } from './business-type.service';
import { BusinessTypeMapper } from './mappers/business-type.mapper';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('business-types')
export class BusinessTypeController extends BaseCrudController(
  CreateBusinessTypeDto,
  UpdateBusinessTypeDto,
  { roles: { "create": ["ADMIN"] } }
)<BusinessTypeEntity> {
  constructor(service: BusinessTypeService, mapper: BusinessTypeMapper) {
    super(service, mapper);
  }
}
