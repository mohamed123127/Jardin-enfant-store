import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TenantsModule } from 'src/modules/tenancy/tenants/tenants.module';


import { ProductImageMapper } from './mappers/product-images.mapper';
import { ProductImageEntity } from './entities/product-images.entity';
import { ProductImagesController } from './products-images.controller';
import { ProductImagesService } from './products-images.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductImageEntity
      ,
    ]),

    TenantsModule.forFeature([
      ProductImageEntity,
    ]),
  ],

  controllers: [
    ProductImagesController,
  ],

  providers: [
    ProductImagesService,
    ProductImageMapper,
  ],

  exports: [
    ProductImagesService,
    ProductImageMapper,
  ],
})
export class ProductImagesModule { }