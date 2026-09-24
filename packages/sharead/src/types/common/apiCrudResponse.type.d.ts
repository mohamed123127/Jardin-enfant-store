import { PaginationResult } from "./pagination/Pagination.type";
import { BaseApiResponse } from "./serverResponse.type";
export type GetAllApiResponse<T> = BaseApiResponse & PaginationResult<T>;
export type GetByIdApiResponse<T> = BaseApiResponse & {
    data: T | null;
};
export type SearchApiResponse<T> = BaseApiResponse & PaginationResult<T>;
export type CountApiResponse = BaseApiResponse & {
    count: number;
};
export type CreateApiResponse<T> = BaseApiResponse & {
    data: T | null;
};
export type UpdateApiResponse<T> = BaseApiResponse & {
    data: T | null;
};
export type DeleteApiResponse = BaseApiResponse & {
    data: {
        affected: number;
    };
};
