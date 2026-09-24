import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import { type IMapper } from '../interfaces/mapper.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    constructor(
        protected readonly mapper: IMapper<UserEntity>,
    ) { }

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<any> {
        const response = context.switchToHttp().getResponse();
        const request = context.switchToHttp().getRequest();

        return next.handle().pipe(
            map((result) => {
                const {
                    message,
                    meta,
                    data,
                    ...rest
                } = result;
                return {
                    success: true,
                    statusCode: response.statusCode,
                    message: message ?? "Success",

                    ...(meta !== undefined && { meta }),

                    ...(data !== undefined
                        ? { data }
                        : rest),

                    // user: this.mapper.toResponseDto(request.user),
                };
            }),
        );
    }
}