import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfig from './database/ormConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
    useFactory: (configService: ConfigService) => TypeOrmConfig.getOrmConfig(configService),
    inject: [ConfigService],
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
