import { forwardRef, Module, Scope } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import TypeOrmConfig from './database/ormConfig';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggerInterceptor } from './interceptors/logger.interceptor';
import { TransactionInterceptor } from './interceptors/transaction.interceptor';
import { NodemailerDrivers, NodemailerModule, NodemailerOptions } from "@crowdlinker/nestjs-mailer";
import { config } from 'process';
import { MailerConfig } from './config/Mailer.config';
import { CourseModule } from './modules/course/course.module';
import { AttachmentModule } from './modules/attachment/attachment.module';
import { CategoryModule } from './modules/category/category.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { MuxDataModule } from './modules/mux-data/mux-data.module';
import { UserProgressModule } from './modules/user-progress/user-progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => TypeOrmConfig.getOrmConfig(configService),
      inject: [ConfigService],
    }),
    NodemailerModule.forRootAsync({
      useFactory: (ConfigService: ConfigService) => MailerConfig.getConfig(ConfigService),
      inject: [ConfigService],
    })
    ,
    UsersModule,
    AuthModule,
    CourseModule,
    AttachmentModule,
    CategoryModule,
    ChapterModule,
    MuxDataModule,
    UserProgressModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransactionInterceptor
    },
  ],
})
export class AppModule { }
