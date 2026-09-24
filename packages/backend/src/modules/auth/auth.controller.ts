import { Controller, Get, Post, UseGuards, Body, Req, Res, UnauthorizedException } from "@nestjs/common";
import type { Request, Response } from 'express';
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { Public } from "src/modules/auth/decorators/public.decorator";
import { ValidatedAuthGuard } from "./guards/validated-auth.guard";
import { RefreshJwtAuthGuard } from "./guards/refresh-jwt-auth.guard";
import { User } from "@aio/shared";
import { ConfigService } from "@nestjs/config";

// auth/auth.controller.ts
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
    ) { }

    /** Build the cookie options, reading maxAge from the same config key used to sign the JWT.
     *  This guarantees the cookie and the token expire at the same time. */
    private refreshCookieOptions() {
        // JWT_REFRESH_EXPIRES_IN is expressed as a string like '30d'.
        // Convert it to milliseconds for the cookie maxAge.
        const expiry = this.configService.getOrThrow<string>('auth.jwt.refreshExpiration');
        const ms = require('ms')(expiry) as number;
        return {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/api/v1/auth',       // only sent to /auth/* endpoints
            maxAge: ms,
        };
    }
    // --- Sign up (create tenant + admin) ---
    @Public()
    @Post('sign-up')
    async signUp(
        @Body() dto: SignUpDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.signUp(dto);
        res.cookie('refreshToken', tokens.refresh_token, this.refreshCookieOptions());
        return { access_token: tokens.access_token };
    }

    // --- Local login ---
    @Public()
    @UseGuards(ValidatedAuthGuard('local', LoginDto))
    @Post('login')
    async login(
        @Req() req,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.login(req.user);
        // Set refresh token as httpOnly cookie — never exposed to JS or returned in the body
        res.cookie('refreshToken', tokens.refresh_token, this.refreshCookieOptions());
        return { access_token: tokens.access_token };
    }

    @Public()
    @UseGuards(RefreshJwtAuthGuard)
    @Post('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const user = req.user as User & { refreshToken: string };
        if (!user) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        const tokens = await this.authService.refreshTokens(user);
        // Rotate: clear old cookie and set the new one
        res.cookie('refreshToken', tokens.refresh_token, this.refreshCookieOptions());
        return { access_token: tokens.access_token };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(
        @Req() req,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.logout(req.user.userId);
        // Clear the cookie on the client side
        res.clearCookie('refreshToken', { path: '/api/v1/auth' });
        return { message: 'Logged out' };
    }

    // --- Google login ---
    // @UseGuards(GoogleAuthGuard)
    @Public()
    @Get('google')
    async googleAuth() {
        // redirects to Google — this method body never runs
    }

    // @UseGuards(GoogleAuthGuard)
    @Get('google/callback')
    async googleAuthCallback(@Req() req) {
        // req.user was set by GoogleStrategy.validate()
        return this.authService.login(req.user); // issue our own JWT
    }

    // --- Protected route (authorization) ---
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return req.user;
    }
}
