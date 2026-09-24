import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from 'src/common/base/services/base-crud.service';
import { ProductEntity } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { assertUnique } from 'src/common/utils/dataBase-validation.util';
import { InjectTenantRepository } from '../../../common/decorators/tenant-repo.decorator';
import { TenantRepository } from 'src/common/base/repositories/tenant-repository';
import { ClsService } from 'nestjs-cls';
import { BarcodeGenerator } from './utils/barcode-generator.util';
import { SearchField } from 'src/types/search.type';
import { ComputedFieldMap } from 'src/types/Fields.type';

@Injectable()
export class ProductsService extends BaseCrudService<ProductEntity, CreateProductDto, UpdateProductDto> {
  override allowedSearchableFields: SearchField<ProductEntity>[] = [{ field: "name", operator: "ilike" }, { field: "barcode", operator: "ilike" }];
  override allowedFilterFields: (keyof ProductEntity)[] = ["status", "quantity"];
  override computedFields: ComputedFieldMap<ProductEntity> = {
    quantity: `(SELECT COALESCE(SUM(v.quantity), 0) FROM product_variants v WHERE v."productId" = entity.id)`,
  };

  constructor(
    @InjectTenantRepository(ProductEntity) repo: TenantRepository<ProductEntity>,
    private readonly barcodeGenerator: BarcodeGenerator,
    private readonly clsService: ClsService) {
    super(repo);
    this.entityPluralName = "Products";
    this.defaultRelations = {
      images: true,
      variants: {
        variants: {
          attributeValue: {
            attribute: true
          }
        }
      }
    };
  }

  protected override async validateCreate(entity: ProductEntity): Promise<void> {
    await assertUnique(this.repository, [
      {
        field: 'name',
        value: entity.name
      }
    ], 'ProductEntity');
  }

  protected override async validateUpdate(entity: ProductEntity): Promise<void> {
    await assertUnique(this.repository, [
      {
        field: 'name',
        value: entity.name
      }
    ], 'ProductEntity');
  }

  protected override async beforSaveCreate(entity: ProductEntity, dto: CreateProductDto): Promise<void> {
    entity.barcode = await this.barcodeGenerator.generateBarcode(this.clsService.get('tenantId'));
    return super.beforSaveCreate(entity, dto);
  }
}
