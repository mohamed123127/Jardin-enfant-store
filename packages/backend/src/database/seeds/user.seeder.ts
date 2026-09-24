import { DataSource } from 'typeorm';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

import { UserEntity } from 'src/modules/users/entities/user.entity';
import usersList from '../mock-data/users.json';
import { SeederFactoryManager, Seeder } from 'typeorm-extension';
export class UserSeeder implements Seeder {
    async run(
        dataSource: DataSource,
        factoryManager: SeederFactoryManager,
    ): Promise<void> {
        await saveRealUsers(dataSource)
    }
}

async function saveRealUsers(dataSource: DataSource) {
    const userRepo = dataSource.getRepository(UserEntity);

    for (const item of usersList) {
        await userRepo.save({
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            phone: item.phone,

            hashedPassword: await bcrypt.hash(
                item.password,
                10,
            ),

            role: item.role,

            tenantId: item.tenantId,
        });
    }
}