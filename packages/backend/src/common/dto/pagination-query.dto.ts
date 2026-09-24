// pagination-query.dto.ts
import { IsArray, IsIn, IsInt, IsObject, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { Filter } from '@aio/shared';

export class PaginationQueryDto {
    @IsOptional() @Type(() => Number) @IsInt() @Min(1)
    page: number = 1;

    @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100)
    limit: number = 10;

    @IsOptional() @IsString()
    sortBy?: string;

    @IsOptional() @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC' = 'ASC';
}

export class SearchDto<Entity> {
    @IsOptional()
    @IsString()
    @MaxLength(200)
    searchText?: string;

    @IsOptional()
    @IsArray()
    filters?: Filter<Entity>[];
}