// export type SearchParamsType = {
//     page: number;
//     limit: number;
//     sortBy: string;
//     sortOrder: 'ASC' | 'DESC';
//     searchTerm: string;
//     filters: Record<string, string | string[]>;
// }

import { FindOptionsOrder, FindOptionsRelations, FindOptionsWhere } from "typeorm";
import { Filter } from "./filter.type";

// export type PageMetaDto = {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
// }

export class SearchBody {
    filters?: Filter<any>[];
    searchText?: string;
}

