import { Injectable } from '@nestjs/common';

import { BaseCrudService } from 'src/common/base/services/base-crud.service';

import { InjectTenantRepository } from 'src/common/decorators/tenant-repo.decorator';
import { TenantRepository } from 'src/common/base/repositories/tenant-repository';

import { SearchField } from 'src/types/search.type';
import { ProductImageEntity } from './entities/product-images.entity';
import { CreateProductImageDto } from './dto/create-product-images.dto';
import { UpdateProductImageDto } from './dto/update-product-images.dto';

@Injectable()
export class ProductImagesService extends BaseCrudService<
  ProductImageEntity,
  CreateProductImageDto,
  UpdateProductImageDto
> {
  override allowedSearchableFields: SearchField<ProductImageEntity>[] = [
    {
      field: 'alt',
      operator: 'ilike',
    },
    {
      field: 'url',
      operator: 'ilike',
    },
  ];

  override allowedFilterFields: (keyof ProductImageEntity)[] = [
    'productId',
    'position',
  ];

  constructor(
    @InjectTenantRepository(ProductImageEntity)
    repo: TenantRepository<ProductImageEntity>,
  ) {
    super(repo);

    this.entityPluralName = 'Product images';

    this.defaultRelations = {
      product: true,
    };
  }

  protected override async beforSaveCreate(
    entity: ProductImageEntity,
    dto: CreateProductImageDto,
  ): Promise<void> {

    return super.beforSaveCreate(entity, dto);
  }

  private async removeCurrentPrimary(
    productId: string,
    excludeId?: number,
  ): Promise<void> {
    const images = await this.repository.find({
      where: {
        productId,
      },
    });

    const imagesToUpdate = excludeId
      ? images.filter((image) => image.id !== excludeId)
      : images;

    if (!imagesToUpdate.length) {
      return;
    }

    await this.repository.save(imagesToUpdate);
  }
}