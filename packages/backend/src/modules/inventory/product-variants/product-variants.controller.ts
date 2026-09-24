import { Body, Controller, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { BaseCrudController } from 'src/common/base/controllers/base-crud.controller';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { DecreaseQuantityDto } from './dto/decrease-quantity.dto';
import { ProductVariantEntity } from './entities/product-variant.entity';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantMapper } from './mappers/product-variant.mapper';
import { Public } from 'src/modules/auth/decorators/public.decorator';

@Controller('ProductVariants')
export class ProductVariantsController extends BaseCrudController(
  CreateProductVariantDto,
  UpdateProductVariantDto,
)<ProductVariantEntity> {
  constructor(
    private readonly productVariantsService: ProductVariantsService,
    mapper: ProductVariantMapper,
  ) {
    super(productVariantsService, mapper);
  }

  @Public()
  @Patch(':id/decrease-quantity')
  async decreaseQuantity(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DecreaseQuantityDto,
  ) {
    const amount = dto.quantityToDecrease ?? dto.quantity ?? 1;
    const updatedVariant = await this.productVariantsService.decreaseQuantity(+id, amount);
    return {
      message: 'Product variant quantity decreased successfully',
      data: this.mapper.toResponseDto(updatedVariant),
    };
  }
}
