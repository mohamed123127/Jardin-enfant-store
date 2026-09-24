export type PaginationOptions = {
    page: number;
    limit: number;
};
export type PaginationResult<T> = {
    data: T[];
    meta: PaginationMetaData;
};
export type PaginationMetaData = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
} | null;
