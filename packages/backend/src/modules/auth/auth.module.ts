import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { StringValue } from 'ms';
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { TenancyModule } from "../tenancy/tenancy.module";
import { TenantsModule } from "../tenancy/tenants/tenants.module";

// auth/auth.module.ts
@Module({
    imports: [
        PassportModule,
        // registerAsync defers reading JWT_SECRET until ConfigModule has loaded the .env file.
        // Using JwtModule.register({ secret: process.env.JWT_SECRET }) would read the env var
        // at decorator-evaluation time — before ConfigModule has a chance to populate it.
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.getOrThrow<string>('auth.jwt.secret'),
                signOptions: { expiresIn: config.getOrThrow<StringValue>('auth.jwt.expiration') },
            }),
        }),
        UsersModule,
        TenantsModule
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, RefreshTokenStrategy],
})
export class AuthModule { }
