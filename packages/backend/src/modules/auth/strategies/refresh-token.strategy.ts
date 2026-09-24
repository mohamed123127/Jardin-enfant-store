// auth/strategies/refresh-token.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { tokenPayload } from '../types/tokenPayload.type';

const REFRESH_COOKIE_NAME = 'refreshToken';
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private readonly configService: ConfigService) {
        super({
            // Extract the JWT from the httpOnly cookie — never from the Authorization header.
            // This prevents the refresh token from being exposed to JavaScript or logged in request headers.
            jwtFromRequest: (req: Request) => req.cookies?.[REFRESH_COOKIE_NAME] ?? null,
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('auth.jwt.refreshSecret')!,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: tokenPayload) {
        const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
        if (!refreshToken) {
            throw new UnauthorizedException('No refresh token provided');
        }
        // Attach the raw token so authService.refreshTokens() can verify it against the DB hash
        return {
            id: payload.sub,
            userId: payload.sub,
            email: payload.email,
            firstName: payload.firstName,
            lastName: payload.lastName,
            refreshToken,
            role: payload.role,
            tenantId: payload.tenantId,
        };
    }
}