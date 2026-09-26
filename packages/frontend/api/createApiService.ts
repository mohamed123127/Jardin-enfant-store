// api/createApiService.ts
import { GetAllApiResponse, GetByIdApiResponse, CreateApiResponse, UpdateApiResponse, DeleteApiResponse, SearchApiResponse, SearchBody, CountApiResponse } from '@aio/shared';
import { apiClient } from './client';

interface ApiServiceConfig {
    baseUrl: string;
}

export function createApiService<T, TCreate = Partial<T>, TUpdate = Partial<T>>(
    config: ApiServiceConfig
) {
    const { baseUrl } = config;

    return {
        getAll: async (): Promise<GetAllApiResponse<T>> => {
            const { data } = await apiClient.get<GetAllApiResponse<T>>(baseUrl + "?limit=25");
            console.log(data);
            if (!data.success) {
                throw new Error(data.message);
            }
            return data;
        },

        count: async (payload: SearchBody): Promise<CountApiResponse> => {
            const { data } = await apiClient.post<CountApiResponse>(baseUrl + "/count", payload);
            if (!data.success) {
                throw new Error(data.message);
            }
            return data;
        },

        getById: async (id: string | number): Promise<GetByIdApiResponse<T>> => {
            const { data } = await apiClient.get<GetByIdApiResponse<T>>(`${baseUrl}/${id}`, {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                },
                params: {
                    _t: Date.now(),
                },
            });
            if (!data.success) {
                throw new Error(data.message);
            }
            return data;
        },

        search: async (payload: SearchBody, page: number = 1, limit: number = 100): Promise<SearchApiResponse<T>> => {
            const { data } = await apiClient.post<SearchApiResponse<T>>(`${baseUrl}/search?page=${page}&limit=${limit}`, payload);
            if (!data.success) {
                throw new Error(data.message);
            }
            return data;
        },

        create: async (payload: TCreate): Promise<CreateApiResponse<T>> => {
            const { data } = await apiClient.post<CreateApiResponse<T>>(baseUrl, payload);
            if (!data.success) {
                throw new Error(data.message);
            }
            return data;
        },

        update: async (id: string | number, payload: TUpdate): Promise<UpdateApiResponse<T>> => {
            const { data } = await apiClient.put<UpdateApiResponse<T>>(`${baseUrl}/${id}`, payload);
            if (!data.success) {
                throw new Error(data.message);
            }
            return data;
        },

        remove: async (id: string | number): Promise<DeleteApiResponse> => {
            const { data } = await apiClient.delete<DeleteApiResponse>(`${baseUrl}/${id}`);
            if (!data.success) {
                throw new Error(data.message);
            }
            return data;
        },
    };
}