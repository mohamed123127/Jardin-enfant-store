import {
  Controller,
  UseGuards,
} from '@nestjs/common';

import { BaseCrudController } from 'src/common/base/controllers/base-crud.controller';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateProductImageDto } from './dto/create-product-images.dto';
import { UpdateProductImageDto } from './dto/update-product-images.dto';
import { ProductImageEntity } from './entities/product-images.entity';
import { ProductImageMapper } from './mappers/product-images.mapper';
import { ProductImagesService } from './products-images.service';

@UseGuards(JwtAuthGuard)
@Controller('product-images')
export class ProductImagesController extends BaseCrudController(
  CreateProductImageDto,
  UpdateProductImageDto,
)<ProductImageEntity> {
  constructor(
    service: ProductImagesService,
    mapper: ProductImageMapper,
  ) {
    super(service, mapper);
  }
}