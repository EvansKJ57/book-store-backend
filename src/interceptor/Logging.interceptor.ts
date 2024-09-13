import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, url } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        if (userAgent.includes('ELB-HealthChecker')) {
          return;
        }
        const statusCode = res.statusCode;
        const endTime = Date.now();
        this.logger.log(
          `${method} ${url} ${statusCode} \x1b[33m+${endTime - startTime}ms\x1b[0m`,
        );
      }),
      catchError((error) => {
        const endTime = Date.now();
        const statusCode =
          error instanceof HttpException ? error.getStatus() : 500;

        if (statusCode === 500) {
          this.logger.error(
            `${method} ${url} ${statusCode}  \x1b[33m+${endTime - startTime}ms\x1b[0m  \nError: ${error.message} \nErrorStack : ${error.stack}`,
          );
        } else {
          this.logger.warn(
            `${method} ${url} ${statusCode}  \x1b[33m+${endTime - startTime}ms\x1b[0m  \nError: ${error.message} \nErrorStack : ${error.stack}`,
          );
        }

        throw error;
      }),
    );
  }
}
