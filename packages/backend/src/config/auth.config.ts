import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => {
    console.log('=== AUTH CONFIG DEBUG ===');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log(
        'JWT_SECRET:',
        process.env.JWT_SECRET ? 'EXISTS' : 'MISSING',
    );
    console.log(
        'JWT_EXPIRES_IN:',
        process.env.JWT_EXPIRES_IN ?? 'MISSING',
    );
    console.log(
        'JWT_REFRESH_SECRET:',
        process.env.JWT_REFRESH_SECRET ? 'EXISTS' : 'MISSING',
    );

    return {
        jwt: {
            secret: process.env.JWT_SECRET,
            expiration: process.env.JWT_EXPIRES_IN,
            refreshSecret: process.env.JWT_REFRESH_SECRET,
            refreshExpiration: process.env.JWT_REFRESH_EXPIRES_IN,
        },
    };
});