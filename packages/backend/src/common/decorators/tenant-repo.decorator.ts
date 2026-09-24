// tenant-repo.decorator.ts
import { Inject } from '@nestjs/common';
import { getTenantRepositoryToken } from '../utils/tenant-repository-tokenization.token';

export const InjectTenantRepository = (entity: Function) => Inject(getTenantRepositoryToken(entity));