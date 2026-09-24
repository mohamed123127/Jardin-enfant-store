import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantEntity } from './entities/tenant.entity';
import { TenantMapper } from './mappers/tenant.mapper';
import { createTenantRepositoryProvider } from 'src/common/providers/tenant-repository.provider';

@Module({
    imports: [TypeOrmModule.forFeature([TenantEntity])],
    controllers: [TenantsController],
    providers: [TenantsService, TenantMapper],
    exports: [TenantsService, TenantMapper],
})
export class TenantsModule {
    static forFeature(entities: Function[]): DynamicModule {
        const providers: Provider[] = entities.map(createTenantRepositoryProvider);
        return {
            module: TenantsModule,
            providers,
            exports: providers,
        };
    }
}