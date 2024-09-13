import { Request } from 'express';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Transaction } from '../interceptors/transaction.interceptor';

export class BaseRepository {
  constructor(private dataSource: DataSource, private request: Request) {}

  protected getRepository<T>(entityCls: new () => T): Repository<T> {//! naming of this process
    const entityManager: EntityManager = this.request[Transaction] ?? this.dataSource.manager;
    return entityManager.getRepository(entityCls);
  }
}