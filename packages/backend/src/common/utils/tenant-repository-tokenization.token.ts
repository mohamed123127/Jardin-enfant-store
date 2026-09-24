// tenant-repository.token.ts
export function getTenantRepositoryToken(entity: Function): string {
    return `TENANT_REPOSITORY_${entity.name}`;
}