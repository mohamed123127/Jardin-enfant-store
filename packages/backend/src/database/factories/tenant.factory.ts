import { faker } from '@faker-js/faker';
import { TenantEntity } from 'src/modules/tenancy/tenants/entities/tenant.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(TenantEntity, () => {
    const fakeTenant = new TenantEntity();

    fakeTenant.name = "Jardin d'enfants";
    fakeTenant.slug = "jardin-denfants";
    return fakeTenant;
});