import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default class TypeOrmConfig {
  static getOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
    const sslEnabled = configService.get<string>('DB_SSL') === 'true';
    return {
      type: 'postgres',
      host: configService.get<string>('POSTGRES_HOST'),
      port: configService.get<number>('POSTGRES_PORT'),
      username: configService.get<string>('POSTGRES_USER'),
      password: configService.get<string>('POSTGRES_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: configService.get<boolean>('DB_SYNC', false),
      logging: configService.get<boolean>('DB_LOGGING', false),
      ssl: sslEnabled ? { rejectUnauthorized: false } : undefined,
      migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
      migrationsTableName: 'migrations',
      dropSchema: configService.get<boolean>('DB_DROP_SCHEMA', false)
    };
  }
}
