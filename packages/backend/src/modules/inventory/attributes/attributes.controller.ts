import { Controller, Get, Query } from '@nestjs/common';
import { BaseCrudController } from 'src/common/base/controllers/base-crud.controller';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { AttributeEntity } from './entities/attribute.entity';
import { AttributesService } from './attributes.service';
import { AttributeMapper } from './mappers/attribute.mapper';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FindOptionsOrder } from 'typeorm';

@Controller('attributes')
export class AttributesController extends BaseCrudController(
  CreateAttributeDto,
  UpdateAttributeDto,
)<AttributeEntity> {
  constructor(service: AttributesService, mapper: AttributeMapper) {
    super(service, mapper);
  }

  @Public()
  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    const order = query.sortBy
      ? ({ [query.sortBy]: query.sortOrder ?? 'ASC' } as FindOptionsOrder<AttributeEntity>)
      : undefined;

    const result = await this.service.findAll(query, order);
    const limit = query.limit || 10;
    const totalPages = Math.ceil(result.total / limit);

    return {
      message: `${this.service.printableEntityName(true)} fetched successfully`,
      meta: {
        total: result.total,
        page: query.page,
        limit: query.limit,
        totalPages,
      },
      data: this.mapper.toSummaryDtoList(result.data),
    };
  }
}
