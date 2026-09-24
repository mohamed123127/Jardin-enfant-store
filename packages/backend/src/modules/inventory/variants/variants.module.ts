import { Module } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VariantEntity } from './entities/variant.entity';
import { AttributesModule } from '../attributes/attributes.module';
import { AttributeValuesModule } from '../attribute-values/attribute-values.module';
import { ProductVariantsModule } from '../product-variants/product-variants.module';
import { VariantMapper } from './mappers/variant.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([VariantEntity]), AttributesModule, AttributeValuesModule, ProductVariantsModule],
  controllers: [VariantsController],
  providers: [VariantsService, VariantMapper],
  exports: [VariantsService, VariantMapper],
})
export class VariantsModule { }
