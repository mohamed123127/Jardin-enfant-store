import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from 'src/common/base/services/base-crud.service';
import { assertUnique } from 'src/common/utils/dataBase-validation.util';
import { CreateBusinessTypeDto } from './dto/create-business-type.dto';
import { UpdateBusinessTypeDto } from './dto/update-business-type.dto';
import { BusinessTypeEntity } from './entities/business-type.entity';

@Injectable()
export class BusinessTypeService extends BaseCrudService<BusinessTypeEntity, CreateBusinessTypeDto, UpdateBusinessTypeDto> {
  constructor(@InjectRepository(BusinessTypeEntity) repo: Repository<BusinessTypeEntity>) {
    super(repo);
    this.defaultRelations = { categories: true, attributes: true, tenants: true };
  }

  protected override async validateCreate(entity: BusinessTypeEntity) {
    await assertUnique(this.repository, [{ field: "name", value: entity.name }], this.printableEntityName());
  }

  protected override async validateUpdate(entity: BusinessTypeEntity) {
    await assertUnique(this.repository, [{ field: "name", value: entity.name }], this.printableEntityName());
  }
}
