import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMapper } from './mappers/user.mapper';
import { TenantsModule } from '../tenancy/tenants/tenants.module';
import { UserEntity } from './entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        TenantsModule.forFeature([UserEntity]),
        TenantsModule
    ],
    controllers: [UsersController],
    providers: [UsersService, UserMapper],
    exports: [UsersService, UserMapper]
})
export class UsersModule { }
