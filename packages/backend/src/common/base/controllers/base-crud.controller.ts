import {
    BadRequestException,
    Body,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Put,
    Query,
    Type,
    UseGuards,
} from '@nestjs/common';
import { BaseEntity } from 'src/common/entities/base.entity';
import { IService } from 'src/common/interfaces/IService.interface';
import { IMapper } from 'src/common/interfaces/mapper.interface';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { AuthorizationOptions } from 'src/modules/auth/types/authorization-options.type';
import { PaginationQueryDto, SearchDto } from 'src/common/dto/pagination-query.dto';
import { type FindOptionsOrder, type FindOptionsRelations, type FindOptionsWhere } from 'typeorm';
import { Filter } from '@aio/shared';
import { Public } from 'src/modules/auth/decorators/public.decorator';

export type CrudAction = 'create' | 'findAll' | 'search' | 'count' | 'findOne' | 'update' | 'remove';

// ─── Named host class ────────────────────────────────────────────────────────
// TypeScript TS4094 forbids `protected`/`private` members on anonymous
// exported class types. Declaring `service` here on a named exported abstract
// class means the anonymous mixin can inherit it without triggering TS4094.
export abstract class BaseCrudControllerHost<Entity extends BaseEntity, CreateDto, UpdateDto> {

    constructor(
        protected readonly service: IService<Entity, CreateDto, UpdateDto>,
        protected readonly mapper: IMapper<Entity>
    ) { }
}

/**
 * Mixin factory for a generic CRUD controller.
 *
 * Because TypeScript erases generic type parameters at runtime,
 * `emitDecoratorMetadata` would emit `Object` instead of the real DTO class
 * for `@Body()` parameters — causing NestJS ValidationPipe to silently skip
 * validation. Passing the concrete classes here lets us patch the
 * `design:paramtypes` reflection metadata so the pipe sees the right types.
 *
 * Usage:
 *   @Controller('users')
 *   export class UserController extends BaseCrudController(CreateUserDto, UpdateUserDto)<User> {
 *     constructor(service: UserService) { super(service); }
 *   }
 */

export function BaseCrudController<CreateDto, UpdateDto>(
    createDtoClass: Type<CreateDto>,
    updateDtoClass: Type<UpdateDto>,
    permissions: AuthorizationOptions = {},
) {
    const rolesFor = (action: CrudAction): string[] => {
        if (!permissions.roles) return [];
        if (Array.isArray(permissions.roles)) return permissions.roles;
        return permissions.roles[action] ?? [];
    };

    @UseGuards(RolesGuard)
    abstract class BaseCrudControllerMixin<Entity extends BaseEntity>
        extends BaseCrudControllerHost<Entity, CreateDto, UpdateDto> {

        @Roles(...rolesFor('create'))
        @Post()
        @Public()
        create(@Body() dto: CreateDto) {
            return this.service.create(dto);
        }

        @Roles(...rolesFor('findAll'))
        @Get()
        @Public()
        async findAll(@Query() query: PaginationQueryDto) {
            //mapped type of inputs to typeorm types
            const order = query.sortBy
                ? ({ [query.sortBy]: query.sortOrder ?? 'ASC' } as FindOptionsOrder<Entity>)
                : undefined;

            const result = await this.service.findAll(query, order);
            const totalPages = Math.ceil(result.total / query.limit);
            return {
                message: `${this.service.printableEntityName(true)} fetched successfully`,
                meta: {
                    total: result.total,
                    page: query.page,
                    limit: query.limit,
                    totalPages
                },
                data: this.mapper.toSummaryDtoList(result.data),
            };
        }

        @Roles(...rolesFor('count'))
        @Post('count')
        @Public()
        async count(@Body() body?: SearchDto<Entity>) {
            // this.validateFilters(body?.filters);
            const filters = body?.filters ? (body.filters as Filter<Entity>[]) : undefined;

            const searchText = body?.searchText ? body.searchText : undefined;

            const result = await this.service.count(searchText, filters);
            return {
                message: `${this.service.printableEntityName(true)} count fetched successfully`,
                count: result.count,
            };
        }

        @Roles(...rolesFor('search'))
        @Post('search')
        @Public()
        async search(@Query() query: PaginationQueryDto, @Body() body?: SearchDto<Entity>) {
            //mapped type of inputs to typeorm types
            const order = query.sortBy
                ? ({ [query.sortBy]: query.sortOrder ?? 'ASC' } as FindOptionsOrder<Entity>)
                : undefined;


            // this.validateFilters(body?.filters);
            const filters = body?.filters ? (body.filters as Filter<Entity>[]) : undefined;

            const searchText = body?.searchText ? body.searchText : undefined;

            const result = await this.service.search(
                searchText,
                filters,
                { page: query.page, limit: query.limit },
                order,
            );
            const totalPages = Math.ceil(result.total / query.limit);
            return {
                message: `${this.service.printableEntityName(true)} searched successfully`,
                meta: {
                    total: result.total,
                    page: query.page,
                    limit: query.limit,
                    totalPages
                },
                data: this.mapper.toSummaryDtoList(result.data),
            };
        }

        @Roles(...rolesFor('findOne'))
        @Get(':id')
        @Public()
        async findOne(@Param('id', ParseIntPipe) id: number) {
            const entity = await this.service.findOne(+id);
            return {
                message: `${this.service.printableEntityName()} fetched successfully`,
                data: this.mapper.toResponseDto(entity),
            };
        }

        @Roles(...rolesFor('update'))
        @Put(':id')
        @Public()
        update(
            @Param('id') id: number,
            @Body() dto: UpdateDto,
        ) {
            return this.service.update(+id, dto);
        }

        @Roles(...rolesFor('remove'))
        @Delete(':id')
        @Public()
        remove(@Param('id') id: number) {
            return this.service.remove(+id);
        }
    }



    // Patch the metadata that TypeScript's emitDecoratorMetadata would have
    // emitted as `Object` (due to generic erasure). NestJS reads
    // 'design:paramtypes' to determine which class to pass to ValidationPipe.
    Reflect.defineMetadata(
        'design:paramtypes',
        [createDtoClass],
        BaseCrudControllerMixin.prototype,
        'create',
    );

    Reflect.defineMetadata(
        'design:paramtypes',
        [Number, updateDtoClass],
        BaseCrudControllerMixin.prototype,
        'update',
    );

    // Cast to a generic abstract constructor so:
    //   1. `Entity` stays open → subclasses can write `extends ...(Dto, Dto)<User>`
    //   2. The anonymous class never leaks → TS4094 is avoided
    return BaseCrudControllerMixin as abstract new <Entity extends BaseEntity>(
        service: IService<Entity, CreateDto, UpdateDto>,
        mapper: IMapper<Entity>
    ) => BaseCrudControllerHost<Entity, CreateDto, UpdateDto>;
}

