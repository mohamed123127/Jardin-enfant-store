import { Controller, Post } from '@nestjs/common';
import { BaseCrudController } from 'src/common/base/controllers/base-crud.controller';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductMapper } from './mappers/product.mapper';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@Controller('products')
export class ProductsController extends BaseCrudController(
  CreateProductDto,
  UpdateProductDto,
)<ProductEntity> {
  constructor(
    private readonly productsService: ProductsService,
    mapper: ProductMapper,
  ) {
    super(productsService, mapper);
  }

  @Public()
  @Post('clear-cache')
  async clearCache() {
    await this.productsService.clearCache();
    return {
      success: true,
      message: 'Products cache cleared successfully',
    };
  }
}
