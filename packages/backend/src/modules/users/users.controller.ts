import { Controller } from '@nestjs/common';
import { BaseCrudController } from 'src/common/base/controllers/base-crud.controller';
import { UserEntity } from './entities/user.entity';
import { UsersService } from './users.service';
import { UserMapper } from './mappers/user.mapper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController extends BaseCrudController(CreateUserDto, UpdateUserDto)<UserEntity> {
    constructor(service: UsersService, mapper: UserMapper) {
        super(service, mapper);
    }
}