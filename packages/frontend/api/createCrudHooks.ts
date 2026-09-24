
// hooks/createCrudHooks.ts
import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';
import { createApiService } from './createApiService';
import { createQueryKeys } from './createQueryKeys';
import { CountApiResponse, CountResponse, CreateResponse, DeleteResponse, Filter, GetAllApiResponse, GetAllResponse, GetByIdApiResponse, GetByIdResponse, SearchApiResponse, SearchBody, SearchResponse, UpdateResponse } from '@aio/shared';

export function createCrudHooks<T extends { id: string | number }, TCreate = Partial<T>, TUpdate = Partial<T>>(
    entity: string,
    baseUrl: string
) {
    const api = createApiService<T, TCreate, TUpdate>({ baseUrl });
    const keys = createQueryKeys(entity);

    function useList(
        options?: Partial<UseQueryOptions<GetAllApiResponse<T>>>
    ): GetAllResponse<T> {
        const query = useQuery<GetAllApiResponse<T>>({
            queryKey: keys.lists(),
            queryFn: api.getAll,
            ...options,
        });

        return {
            data: query.data?.data ?? [],
            meta: query.data?.meta ?? null,
            isLoading: query.isLoading,
            error: query.error,
        };
    }

    function useCount(
        filters: Filter<T>[],
        options?: Partial<UseQueryOptions<CountApiResponse>>
    ): CountResponse {
        const searchText = filters.find(
            ({ key }) => key === "searchText"
        )?.value;

        const formattedFilters = filters
            .filter(({ key }) => key !== "searchText")
            .map(({ key, value, operator }) => ({
                key,
                value,
                operator,
            }));

        const formattedPayload = {
            searchText,
            filters: formattedFilters,
        };
        const query = useQuery<CountApiResponse>({
            queryKey: keys.count(formattedPayload),
            queryFn: () => api.count(formattedPayload),
            ...options,
        });

        return {
            count: query.data?.count ?? 0,
            isLoading: query.isLoading,
            error: query.error,
        };
    }

    function useDetail(id: string | number, options?: Partial<UseQueryOptions<GetByIdApiResponse<T>>>
    ): GetByIdResponse<T> {
        const query = useQuery({
            queryKey: keys.detail(id),
            queryFn: () => api.getById(id),
            enabled: !!id,
            ...options,
        });

        return {
            data: query.data?.data ?? null,
            isLoading: query.isLoading,
            error: query.error,
        }
    }

    function useSearch(
        filters: Filter<T>[],
        params?: { page?: number; limit?: number },
        options?: Partial<UseQueryOptions<SearchApiResponse<T>>>
    ): SearchResponse<T> {
        const searchText = filters.find(
            ({ key }) => key === "searchText"
        )?.value;

        const formattedFilters = filters
            .filter(({ key }) => key !== "searchText")
            .map(({ key, value, operator }) => ({
                key,
                value,
                operator,
            }));

        const formattedPayload = {
            searchText,
            filters: formattedFilters,
        };
        const page = params?.page ?? 1;
        const limit = params?.limit ?? 100;

        const query = useQuery<SearchApiResponse<T>>({
            queryKey: [...keys.list(formattedPayload), page, limit],
            queryFn: () => api.search(formattedPayload, page, limit),
            ...options,
        });

        return {
            data: query.data?.data ?? [],
            meta: query.data?.meta ?? null,
            isLoading: query.isLoading,
            error: query.error,
        };
    }

    function useCreate(): CreateResponse<T> {
        const queryClient = useQueryClient();
        const query = useMutation({
            mutationFn: (payload: TCreate) => api.create(payload),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: keys.lists() });
            },
        });

        return {
            data: query.data?.data ?? null,
            isPending: query.isPending,
            error: query.error,
        }
    }

    function useUpdate(): UpdateResponse<T> {
        const queryClient = useQueryClient();
        const query = useMutation({
            mutationFn: ({ id, payload }: { id: string | number; payload: TUpdate }) =>
                api.update(id, payload),
            onSuccess: (updated, { id }) => {
                queryClient.setQueryData(keys.detail(id), updated);
                queryClient.invalidateQueries({ queryKey: keys.lists() });
            },
        });

        return {
            data: query.data?.data ?? null,
            isPending: query.isPending,
            error: query.error,
        }
    }

    function useDelete(): DeleteResponse {
        const queryClient = useQueryClient();
        const query = useMutation({
            mutationFn: (id: string | number) => api.remove(id),
            onSuccess: (_data, id) => {
                queryClient.removeQueries({ queryKey: keys.detail(id) });
                queryClient.invalidateQueries({ queryKey: keys.lists() });
            },
        });

        return {
            data: query.data?.data ?? { affected: 0 },
            isPending: query.isPending,
            error: query.error,
        }
    }

    return {
        keys,
        api,       // raw functions, exposed for custom hooks that need to compose
        useList,
        useCount,
        useDetail,
        useSearch,
        useCreate,
        useUpdate,
        useDelete,
    };
}