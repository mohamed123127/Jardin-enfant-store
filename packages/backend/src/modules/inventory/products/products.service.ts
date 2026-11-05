import { Injectable } from '@nestjs/common';
import { FindOptionsOrder } from 'typeorm';
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
import { Filter, PaginationOptions } from '@aio/shared';

@Injectable()
export class ProductsService extends BaseCrudService<ProductEntity, CreateProductDto, UpdateProductDto> {
  override allowedSearchableFields: SearchField<ProductEntity>[] = [{ field: "name", operator: "ilike" }, { field: "barcode", operator: "ilike" }];
  override allowedFilterFields: (keyof ProductEntity)[] = ["status", "quantity"];
  override computedFields: ComputedFieldMap<ProductEntity> = {
    quantity: `(SELECT COALESCE(SUM(v.quantity), 0) FROM product_variants v WHERE v."productId" = entity.id)`,
  };

  /**
   * Full relations used by findOne (product detail page).
   * Loads images and the full variant → attributeValue → attribute chain.
   */
  private readonly detailRelations = {
    images: true,
    variants: {
      variants: {
        attributeValue: {
          attribute: true,
        },
      },
    },
  } as const;

  /**
   * Lightweight relations used for findAll / search (store listing).
   * Only loads variants so the quantity getter works — skips images and
   * the deep attributeValue → attribute chain that the summary mapper never uses.
   */
  private readonly listRelations = {
    variants: true,
  } as const;

  constructor(
    @InjectTenantRepository(ProductEntity) repo: TenantRepository<ProductEntity>,
    private readonly barcodeGenerator: BarcodeGenerator,
    private readonly clsService: ClsService) {
    super(repo);
    this.entityPluralName = "Products";
    // defaultRelations is used by findOne — keep the full depth for the detail page
    this.defaultRelations = this.detailRelations;
  }

  /**
   * Override findAll to use listRelations (no images, no attribute chain).
   * This reduces a 4-level JOIN to a single JOIN for every listing request.
   */
  override async findAll(
    pagination: PaginationOptions,
    order?: FindOptionsOrder<ProductEntity>,
  ): Promise<{ data: ProductEntity[]; total: number }> {
    const [data, total] = await this.repository.findAndCount({
      where: this.defaultFilter,
      order: order || this.defaultOrder,
      relations: this.listRelations,
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
      cache: 30_000, // cache this query for 30 seconds
    });
    return { data, total };
  }

  /**
   * Override search to use listRelations (no images, no attribute chain).
   * The summary mapper (toSummaryDto) only needs quantity, which is computed
   * from the variants getter — the deep attribute chain is not needed here.
   */
  override async search(
    searchText?: string,
    filters?: Filter<ProductEntity>[],
    pagination?: PaginationOptions,
    order?: FindOptionsOrder<ProductEntity>,
  ): Promise<{ data: ProductEntity[]; total: number }> {
    const qb = this.repository.createQueryBuilder('entity');

    // Lightweight relations — skips images and the attributeValue→attribute chain
    qb.setFindOptions({ relations: this.listRelations });

    this.applySearch(qb, searchText);

    if (filters) {
      this.applyFilters(qb, filters);
    }

    this.applyOrder(qb, order);
    this.applyPagination(qb, pagination);

    // Cache listing queries for 30 seconds to absorb repeated store-page loads
    qb.cache(30_000);

    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }

  /**
   * Clears the TypeORM query result cache so listings immediately reflect stock/product updates.
   */
  async clearCache(): Promise<void> {
    const queryResultCache = this.repository.manager.connection.queryResultCache;
    if (queryResultCache) {
      await queryResultCache.clear();
    }
  }

  override async create(dto: CreateProductDto): Promise<ProductEntity> {
    const created = await super.create(dto);
    await this.clearCache();
    return created;
  }

  override async update(id: number, dto: UpdateProductDto): Promise<ProductEntity> {
    const updated = await super.update(id, dto);
    await this.clearCache();
    return updated;
  }

  override async remove(id: number) {
    const res = await super.remove(id);
    await this.clearCache();
    return res;
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
