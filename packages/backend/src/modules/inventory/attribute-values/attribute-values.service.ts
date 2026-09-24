import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from 'src/common/base/services/base-crud.service';
import { AttributeValueEntity } from './entities/attribute-value.entity';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { UpdateAttributeValueDto } from './dto/update-attribute-value.dto';
import { assertExists, assertUnique } from 'src/common/utils/dataBase-validation.util';
import { AttributesService } from '../attributes/attributes.service';

import { SearchField } from 'src/types/search.type';

@Injectable()
export class AttributeValuesService extends BaseCrudService<AttributeValueEntity, CreateAttributeValueDto, UpdateAttributeValueDto> {
  override allowedSearchableFields: SearchField<AttributeValueEntity>[] = [{ field: "value", operator: "ilike" }];
  override allowedFilterFields: (keyof AttributeValueEntity)[] = ["attributeId", "value"];

  constructor(
    @InjectRepository(AttributeValueEntity) repo: Repository<AttributeValueEntity>,
    private readonly attributesService: AttributesService
  ) {
    super(repo);
    this.entityPluralName = "AttributeValues";
  }

  protected override async validateCreate(entity: AttributeValueEntity): Promise<void> {
    await assertExists(this.attributesService, entity.attributeId, "Attribute");
    await assertUnique(this.repository, [
      { field: 'value', value: entity.value },
      { field: 'attributeId', value: entity.attributeId }
    ], this.printableEntityName());
  }

  protected override async validateUpdate(entity: AttributeValueEntity): Promise<void> {
    await assertExists(this.attributesService, entity.attributeId, "Attribute");
    await assertUnique(this.repository, [
      { field: 'value', value: entity.value },
      { field: 'attributeId', value: entity.attributeId }
    ], this.printableEntityName());
  }
}
