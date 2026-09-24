import { createCrudHooks } from "@/api/createCrudHooks";
import { BaseEntityShape, Filter } from "@aio/shared";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type useProductsReturn<T> = {
    filteredData: T[];
    meta: any;
    isLoading: boolean;
    error: any;
    filters: Filter<T>[];
    setFilters: Dispatch<SetStateAction<Filter<T>[]>>;
}

export function useProducts<T extends BaseEntityShape>
    (defaultFilters?: Filter<T>[], params?: { page?: number; limit?: number }): useProductsReturn<T> {
    const entityCrud = createCrudHooks<T>("products", "/products");
    const [filters, setFilters] = useState<Filter<T>[]>([]);

    useEffect(() => {
        if (defaultFilters) {
            setFilters(defaultFilters);
        }
    }, [defaultFilters]);

    // useSearch runs whenever `where` changes; empty filters -> empty where -> full list
    const { data, meta, isLoading, error } = entityCrud.useSearch(filters, params);

    return {
        filteredData: data ?? [],
        meta,
        isLoading,
        error,
        filters,
        setFilters
    };
}

export function useProduct<T extends BaseEntityShape>(id: string | number) {
    const entityCrud = createCrudHooks<T>("products", "/products");
    return entityCrud.useDetail(id);
}