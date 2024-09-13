import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, catchError, tap } from 'rxjs';
import { TRANSACTION_KEY } from 'src/decorator/transactional.decorator';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    private readonly dataSource: DataSource,
    private readonly reflector: Reflector,
  ) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const isTransaction = this.reflector.getAllAndOverride<boolean>(
      TRANSACTION_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!isTransaction) {
      return next.handle();
    }
    const req = context.switchToHttp().getRequest();
    const qr = this.dataSource.createQueryRunner();
    req.queryRunner = qr;
    await qr.connect();
    await qr.startTransaction();

    return next.handle().pipe(
      catchError(async (error) => {
        await qr.rollbackTransaction();
        await qr.release();
        throw error;
      }),
      tap(async () => {
        await qr.commitTransaction();
        await qr.release();
      }),
    );
  }
}
