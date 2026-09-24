import { Module } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { ProductVariantsController } from './product-variants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariantEntity } from './entities/product-variant.entity';
import { ProductsModule } from '../products/products.module';
import { ProductVariantMapper } from './mappers/product-variant.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariantEntity]), ProductsModule],
  controllers: [ProductVariantsController],
  providers: [ProductVariantsService, ProductVariantMapper],
  exports: [ProductVariantsService, ProductVariantMapper]
})
export class ProductVariantsModule { }
