import { DataSource } from 'typeorm';
import { runSeeder, Seeder, SeederFactoryManager } from 'typeorm-extension';
import { AttributeSeeder } from './attribute.seeder';
import { AttributeValueSeeder } from './attributeValue.seeder';
import { ProductSeeder } from './product.seeder';
import { ProductVariantSeeder } from './productVariant.factory';
import { VariantSeeder } from './variant.seeder';
import { TenantSeeder } from './tenant.seeder';
import { UserSeeder } from './user.seeder';
import { PlanSeeder } from './plans.seeder';
import { PlanLimitSeeder } from './planLimit.seeder';
import { SubscriptionSeeder } from './subscription.seeder';

export class MainSeeder implements Seeder {
    async run(dataSource: DataSource, factoryManager: SeederFactoryManager) {
        console.log('Seeding tenants...');
        await runSeeder(dataSource, TenantSeeder);
        console.log('Tenants seeded successfully');

        console.log('Seeding users...');
        await runSeeder(dataSource, UserSeeder);
        console.log('users seeded successfully');

        console.log('Seeding attributes...');
        await runSeeder(dataSource, AttributeSeeder);
        console.log('Attributes seeded successfully');

        console.log('Seeding attribute values...');
        await runSeeder(dataSource, AttributeValueSeeder);
        console.log('Attribute values seeded successfully');

        console.log('Seeding products...');
        await runSeeder(dataSource, ProductSeeder);
        console.log('Products seeded successfully');

        console.log("Seeding product variants...")
        await runSeeder(dataSource, ProductVariantSeeder)
        console.log("Product variants seeded successfully")

        console.log("Seeding variants...")
        await runSeeder(dataSource, VariantSeeder)
        console.log("Variants seeded successfully")

        console.log('Seeding plans...');
        await runSeeder(dataSource, PlanSeeder);
        console.log('plans seeded successfully');

        console.log("Seeding plan limits...")
        await runSeeder(dataSource, PlanLimitSeeder)
        console.log("Plan limits seeded successfully")

        console.log("Seeding subscription...")
        await runSeeder(dataSource, SubscriptionSeeder)
        console.log("Subscription seeded successfully")
    }
}