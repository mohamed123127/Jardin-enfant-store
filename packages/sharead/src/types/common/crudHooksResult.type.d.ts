import { GetByIdApiResponse, GetAllApiResponse, CreateApiResponse, UpdateApiResponse, DeleteApiResponse, SearchApiResponse, CountApiResponse } from "./apiCrudResponse.type";
import { BaseApiResponse } from "./serverResponse.type";
type QueryState = {
    isLoading: boolean;
    error: Error | null;
};
type MutationState = {
    isPending: boolean;
    error: Error | null;
};
export type GetAllResponse<T> = Omit<GetAllApiResponse<T>, keyof BaseApiResponse> & QueryState;
export type CountResponse = Omit<CountApiResponse, keyof BaseApiResponse> & QueryState;
export type GetByIdResponse<T> = Omit<GetByIdApiResponse<T>, keyof BaseApiResponse> & QueryState;
export type SearchResponse<T> = Omit<SearchApiResponse<T>, keyof BaseApiResponse> & QueryState;
export type CreateResponse<T> = Omit<CreateApiResponse<T>, keyof BaseApiResponse> & MutationState;
export type UpdateResponse<T> = Omit<UpdateApiResponse<T>, keyof BaseApiResponse> & MutationState;
export type DeleteResponse = Omit<DeleteApiResponse, keyof BaseApiResponse> & MutationState;
export {};
