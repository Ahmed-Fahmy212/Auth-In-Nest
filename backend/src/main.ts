import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // logger: ['error', 'warn', 'log'],
  });
  
  app.setGlobalPrefix('v1');
  app.use(helmet({ crossOriginResourcePolicy: false }));
  
  app.enableCors({
    origin: '*',
    credentials: true,

    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  const configService = app.get(ConfigService);
  const port = configService.get('APP_PORT');

  await app.listen(port);
}
bootstrap();



