// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Observable, catchError, tap } from 'rxjs';
// import { DataSource } from 'typeorm';

// @Injectable()
// export class TransactionInterceptor implements NestInterceptor {
//   constructor(
//     private readonly dataSource: DataSource,
//     private readonly reflector: Reflector,
//   ) {}
//   async intercept(
//     context: ExecutionContext,
//     next: CallHandler<any>,
//   ): Promise<Observable<any>> {
//     const req = context.switchToHttp().getRequest();
//     const qr = this.dataSource.createQueryRunner();
//     req.queryRunner = qr;
//     await qr.connect();
//     await qr.startTransaction();

//     return next.handle().pipe(
//       catchError(async (error) => {
//         await qr.rollbackTransaction();
//         await qr.release();
//         error.message = '트랜잭션 실패.' + error.message;
//         throw error;
//       }),
//       tap(async () => {
//         await qr.commitTransaction();
//         await qr.release();
//       }),
//     );
//   }
// }
