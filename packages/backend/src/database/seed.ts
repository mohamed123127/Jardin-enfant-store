import { runSeeders } from 'typeorm-extension';
import { AppDataSource } from './datasource';
import { faker } from '@faker-js/faker';

AppDataSource.initialize().then(async () => {
    faker.seed(12345);
    await runSeeders(AppDataSource);
    console.log('Seeding complete');
    process.exit();
});