// auth/guards/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { IS_PUBLIC_KEY } from 'src/modules/auth/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {


    constructor(private readonly cls: ClsService, private readonly reflector: Reflector) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        const isValid = (await super.canActivate(context)) as boolean;

        if (isValid) {
            const request = context.switchToHttp().getRequest();
            this.cls.set('tenantId', request.user?.tenantId);
            // this.cls.set('userId', request.user?.userId);
        }

        return isValid;
    }
}
