import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { Observable, catchError, concatMap, finalize, tap } from 'rxjs';
  import { DataSource } from 'typeorm';
  
  export const Transaction = 'Transaction';
  
  @Injectable()
  export class TransactionInterceptor implements NestInterceptor {
    constructor(private dataSource: DataSource) {}
  
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
      const req = context.switchToHttp().getRequest<Request>();
  
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
  
      console.log('💛 TransactionInterceptor started transaction'); 
      req[Transaction] = queryRunner.manager;
  
      return next.handle().pipe(
        tap(async (data) => {
          await queryRunner.commitTransaction();
          console.log('💛 committed transaction');
          return data;
        }),
        catchError(async (e) => {
          await queryRunner.rollbackTransaction();
          console.log('⛔🤍 rolled back transaction');
          throw e;
        }),
        finalize(async () => {
          await queryRunner.release();
          console.log('💛 released connection');
        }),
      );
    }
  }
  