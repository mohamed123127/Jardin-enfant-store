import { Injectable } from '@nestjs/common';
import { BaseCrudService } from 'src/common/base/services/base-crud.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import bcrypt from 'bcrypt';
import { assertExists, assertUnique } from 'src/common/utils/dataBase-validation.util';
import { TenantsService } from '../tenancy/tenants/tenants.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseCrudService<UserEntity, CreateUserDto, UpdateUserDto> {
    override allowedFilterFields: (keyof UserEntity)[] = ['email', 'role', 'isVerified'];

    constructor(
        @InjectRepository(UserEntity) repository: Repository<UserEntity>,
        private readonly tenantService: TenantsService,
    ) {
        super(repository)
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.repository.findOne({ where: { email } });
    }

    protected async validateCreate(entity: UserEntity): Promise<void> {
        await assertUnique(this.repository, [{ field: "email", value: entity.email }]);
        await assertExists(this.tenantService, entity.tenantId, this.printableEntityName());
    }

    protected async validateUpdate(entity: UserEntity): Promise<void> {
        await assertUnique(this.repository, [{ field: "email", value: entity.email }], this.printableEntityName(), entity.id);
        await assertExists(this.tenantService, entity.tenantId, this.printableEntityName());
    }

    protected async beforSaveCreate(entity: UserEntity, dto: CreateUserDto): Promise<void> {
        // hash password
        entity.hashedPassword = await bcrypt.hash(dto.password, 10);
    }

    //functions needed for auth
    async setRefreshToken(userId: number, refreshToken: string | null) {

        const hashed = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;
        await this.update(userId, { hashedRefreshToken: hashed } as UpdateUserDto);
    }

    async getUserIfRefreshTokenMatches(refreshToken: string, userId: number) {
        const user = await this.findOne(userId);
        if (!user?.hashedRefreshToken) return null;

        const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        return isMatch ? user : null;
    }
}
