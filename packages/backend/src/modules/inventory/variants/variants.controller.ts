import { Controller } from '@nestjs/common';
import { BaseCrudController } from 'src/common/base/controllers/base-crud.controller';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UpdateVariantDto } from './dto/update-variant.dto';
import { VariantEntity } from './entities/variant.entity';
import { VariantsService } from './variants.service';
import { VariantMapper } from './mappers/variant.mapper';

@Controller('variants')
export class VariantsController extends BaseCrudController(
  CreateVariantDto,
  UpdateVariantDto,
)<VariantEntity> {
  constructor(service: VariantsService, mapper: VariantMapper) {
    super(service, mapper);
  }
}
