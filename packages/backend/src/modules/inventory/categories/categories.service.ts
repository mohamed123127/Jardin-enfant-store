import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { BaseCrudService } from 'src/common/base/services/base-crud.service';
import { CategoryEntity } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { assertUnique } from 'src/common/utils/dataBase-validation.util';


@Injectable()
export class CategoriesService extends BaseCrudService<CategoryEntity, CreateCategoryDto, UpdateCategoryDto> {
  constructor(@InjectRepository(CategoryEntity) repo: Repository<CategoryEntity>) {
    super(repo);
    this.entityPluralName = "Categories";
  }

  protected override async validateCreate(dto: CreateCategoryDto) {
    await assertUnique(this.repository, [{ field: "name", value: dto.name }], this.printableEntityName());
  }

  protected override async validateUpdate(dto: CreateCategoryDto) {
    await assertUnique(this.repository, [{ field: "name", value: dto.name }], this.printableEntityName());
  }
}