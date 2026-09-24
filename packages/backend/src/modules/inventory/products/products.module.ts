import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ProductMapper } from './mappers/product.mapper';
import { TenantsModule } from 'src/modules/tenancy/tenants/tenants.module';
import { BarcodeGenerator } from './utils/barcode-generator.util';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity]), TenantsModule.forFeature([ProductEntity])],
  controllers: [ProductsController],
  providers: [ProductsService, ProductMapper, BarcodeGenerator],
  exports: [ProductsService, ProductMapper]
})
export class ProductsModule { }
