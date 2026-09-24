import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { CategoryController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategoryMapper } from './mappers/category.mapper';


@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoriesService, CategoryMapper],
  exports: [CategoriesService]
})
export class CategoriesModule { }
