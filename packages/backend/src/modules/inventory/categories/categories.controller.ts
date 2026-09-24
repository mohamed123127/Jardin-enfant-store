import { Controller } from '@nestjs/common';
import { BaseCrudController } from 'src/common/base/controllers/base-crud.controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';
import { CategoriesService } from './categories.service';
import { CategoryMapper } from './mappers/category.mapper';


@Controller('categories')
export class CategoryController extends BaseCrudController(
  CreateCategoryDto,
  UpdateCategoryDto,
)<CategoryEntity> {
  constructor(service: CategoriesService, mapper: CategoryMapper) {
    super(service, mapper);
  }
}