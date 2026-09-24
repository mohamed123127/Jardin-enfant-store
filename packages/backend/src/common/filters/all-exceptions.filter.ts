import {
    Catch,
    ArgumentsHost,
    HttpException,
    ExceptionFilter,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const response = host.switchToHttp().getResponse();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : 500;

        response.status(status).json({
            success: false,
            statusCode: status,
            message:
                exception instanceof HttpException
                    ? exception.message
                    : 'Internal Server Error',
        });
    }
}