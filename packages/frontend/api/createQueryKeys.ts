import { SearchBody } from "@aio/shared"

// api/createQueryKeys.ts
export function createQueryKeys(entity: string) {
    return {
        all: [entity] as const,
        lists: () => [entity, 'list'] as const,
        list: (filters?: SearchBody) => [entity, 'list', filters] as const,
        count: (filters?: SearchBody) => [entity, 'count', filters] as const,
        detail: (id: string | number) => [entity, 'detail', id] as const,
    };
}