import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
    jwt: {
        secret: process.env.JWT_SECRET,
        expiration: process.env.JWT_EXPIRES_IN,
        refreshSecret: process.env.JWT_REFRESH_SECRET,
        refreshExpiration: process.env.JWT_REFRESH_EXPIRES_IN,
    }
}));