import { Controller } from '@nestjs/common';
import { BaseCrudController } from 'src/common/base/controllers/base-crud.controller';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductMapper } from './mappers/product.mapper';
@Controller('products')
export class ProductsController extends BaseCrudController(
  CreateProductDto,
  UpdateProductDto,
)<ProductEntity> {
  constructor(service: ProductsService, mapper: ProductMapper) {
    super(service, mapper);
  }
}
