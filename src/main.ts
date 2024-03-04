import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppConsole } from './app.console';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new AppConsole(),
    cors: { origin: '*' },
  });
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port, '0.0.0.0');
  app.set('trust proxy', true);
  app.enableShutdownHooks();
}

bootstrap();
