import { Controller } from '@nestjs/common';
import { BaseCrudController } from 'src/common/base/controllers/base-crud.controller';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { AttributeValueEntity } from './entities/attribute-value.entity';
import { AttributeValuesService } from './attribute-values.service';
import { AttributeValueMapper } from './mappers/attribute-value.mapper';

@Controller('attributeValues')
export class AttributeValuesController extends BaseCrudController(
  CreateAttributeValueDto,
  UpdateAttributeValueDto,
)<AttributeValueEntity> {
  constructor(service: AttributeValuesService, mapper: AttributeValueMapper) {
    super(service, mapper);
  }
}
