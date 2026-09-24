// auth/guards/validated-auth.guard.ts
import {
  ExecutionContext,
  Injectable,
  BadRequestException,
  Type,
  mixin,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export function ValidatedAuthGuard(strategyName: string, dtoClass?: Type<any>) {
  @Injectable()
  class MixinGuard extends AuthGuard(strategyName) {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      // Skip body validation entirely if no DTO given (e.g. jwt, google — nothing to validate)
      if (dtoClass) {
        const req = context.switchToHttp().getRequest();
        if (!req.body) {
          throw new BadRequestException('email and password are required');
        }
        const dto = plainToInstance(dtoClass, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
          const messages = errors
            .map((e) => Object.values(e.constraints ?? {}))
            .flat();
          throw new BadRequestException(messages);
        }
      }

      return super.canActivate(context) as Promise<boolean>;
    }
  }

  return mixin(MixinGuard);
}