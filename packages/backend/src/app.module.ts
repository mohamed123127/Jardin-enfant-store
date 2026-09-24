import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import appConfig from './config/app.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import authConfig from './config/auth.config';
import { TenancyModule } from './modules/tenancy/tenancy.module';
import { ClsModule } from 'nestjs-cls';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { UserMapper } from './modules/users/mappers/user.mapper';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        `.env.${process.env.NODE_ENV ?? 'development'}`,
        '.env',
      ],
      load: [appConfig, databaseConfig, authConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (config: ConfigService) => ({
        type: 'postgres',

        host: config.get('database.host'),
        port: config.get<number>('database.port'),

        username: config.get('database.username'),
        password: config.get('database.password'),
        database: config.get('database.database'),

        autoLoadEntities: true,
        synchronize: config.get('app.environment') !== 'production',
      }),
    }),
    ClsModule.forRoot({ // we use cls to store user info in context
      global: true,
      middleware: {
        mount: true,
      },
    }),
    InventoryModule,
    UsersModule,
    AuthModule,
    TenancyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (mapper: UserMapper) => new ResponseInterceptor(mapper),
      inject: [UserMapper],
    }
  ],
})
export class AppModule { }
