import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EntityNotFoundExceptionFilter } from './utils/enitityEception';
import { DuplicateExceptionFilter } from './utils/failedQuery';

import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const configService = app.get(ConfigService);
  app.setGlobalPrefix('v1');
  app.use(helmet({ crossOriginResourcePolicy: false }));

  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.useGlobalFilters(new DuplicateExceptionFilter());
  app.useGlobalFilters(new EntityNotFoundExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  )

  const port = configService.get('APP_PORT');

  await app.listen(port);
}
bootstrap();



