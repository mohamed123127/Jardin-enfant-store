import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { TenantsService } from "../tenancy/tenants/tenants.service";
import { JwtService } from "@nestjs/jwt";
import bcrypt from 'bcrypt';
import { UserEntity } from '../users/entities/user.entity';
import { ConfigService } from "@nestjs/config";
import { StringValue } from 'ms';
import { SignUpDto } from "./dto/sign-up.dto";
import { DataSource } from "typeorm";
import { TenantEntity } from '../tenancy/tenants/entities/tenant.entity';
import { ClsService } from "nestjs-cls";
import { User } from "@aio/shared";

// auth/auth.service.ts
@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private tenantsService: TenantsService,
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly cls: ClsService,
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.hashedPassword))) {
            const { hashedPassword, ...result } = user;
            return result;
        }
        return null;
    }

    async signUp(dto: SignUpDto) {
        const tenant = await this.tenantsService.create(dto.tenant);

        //add the tenant to the cls context to ensure that is available everywhere
        this.cls.set('tenantId', tenant.id);

        // 2. Create the admin user linked to the new tenant
        const user = await this.usersService.create({ ...dto.user, role: 'admin' });


        // 3. Issue tokens so the user is logged in immediately after sign-up
        return this.login(user);
    }

    async login(user: User) {
        const payload = {
            sub: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            tenantId: user.tenantId,
        };
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.getOrThrow<string>('auth.jwt.refreshSecret')!,
            expiresIn: this.configService.getOrThrow<StringValue>('auth.jwt.refreshExpiration')!,
        });
        // update the refresh token in db
        await this.usersService.setRefreshToken(user.id, refresh_token);

        return {
            access_token: this.jwtService.sign(payload),
            refresh_token,
        };
    }

    async refreshTokens(user: User & { refreshToken: string }) {
        // Validate the raw token against the bcrypt hash in the DB.
        // This ensures revoked tokens (e.g. after logout) are rejected even if the JWT signature is valid.
        const validUser = await this.usersService.getUserIfRefreshTokenMatches(
            user.refreshToken,
            user.id,
        );
        if (!validUser) throw new UnauthorizedException('Refresh token has been revoked');

        return this.login(validUser); // issue a fresh rotated pair
    }

    async logout(userId: number) {
        await this.usersService.setRefreshToken(userId, null);
    }
}