import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from 'src/common/base/services/base-crud.service';
import { AttributeEntity } from './entities/attribute.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { assertUnique } from 'src/common/utils/dataBase-validation.util';

import { SearchField } from 'src/types/search.type';

@Injectable()
export class AttributesService extends BaseCrudService<AttributeEntity, CreateAttributeDto, UpdateAttributeDto> {
  override allowedSearchableFields: SearchField<AttributeEntity>[] = [{ field: "name", operator: "ilike" }];
  override allowedFilterFields: (keyof AttributeEntity)[] = ["name"];

  constructor(@InjectRepository(AttributeEntity) repo: Repository<AttributeEntity>) {
    super(repo);
    this.defaultRelations = { attributeValues: true };
  }

  protected override async validateCreate(entity: AttributeEntity) {
    await assertUnique(this.repository, [{ field: "name", value: entity.name }], this.printableEntityName());
  }

  protected override async validateUpdate(entity: AttributeEntity) {
    await assertUnique(this.repository, [{ field: "name", value: entity.name }], this.printableEntityName());
  }
}
