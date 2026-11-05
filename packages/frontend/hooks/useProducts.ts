import { createCrudHooks } from "@/api/createCrudHooks";
import { BaseEntityShape, Filter, PaginationMetaData } from "@aio/shared";
import { keepPreviousData } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type useProductsReturn<T> = {
    filteredData: T[];
    meta: PaginationMetaData;
    isLoading: boolean;
    error: any;
    filters: Filter<T>[];
    setFilters: Dispatch<SetStateAction<Filter<T>[]>>;
}

// Module-scoped — created once, not on every render
const productsCrud = createCrudHooks<any>("products", "/products");

export function useProducts<T extends BaseEntityShape>(
    defaultFilters?: Filter<T>[],
    params?: { page?: number; limit?: number }
): useProductsReturn<T> {
    const [filters, setFilters] = useState<Filter<T>[]>([]);

    useEffect(() => {
        if (defaultFilters) {
            setFilters(defaultFilters);
        }
    }, [defaultFilters]);

    const page = params?.page ?? 1;
    const limit = params?.limit ?? 12;

    // useSearch runs whenever filters or pagination change
    const { data, meta, isLoading, error } = productsCrud.useSearch(
        filters,
        { page, limit },
        { placeholderData: keepPreviousData }
    );

    return {
        filteredData: (data as T[]) ?? [],
        meta: meta as PaginationMetaData,
        isLoading,
        error,
        filters,
        setFilters
    };
}

export function useProduct<T extends BaseEntityShape>(
    id: string | number,
    options?: Partial<any>
) {
    const entityCrud = createCrudHooks<T>("products", "/products");
    return entityCrud.useDetail(id, {
        // Keep data fresh for 5 minutes; re-fetch only on explicit invalidation
        staleTime: 5 * 60 * 1000,
        // Keep the result in cache for 10 minutes after all subscribers unmount
        gcTime: 10 * 60 * 1000,
        // Don't hammer the API every time the user switches tabs
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        ...options,
    });
}