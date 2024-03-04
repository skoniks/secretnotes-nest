import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppInterceptor } from './app.interceptor';
import { AppLoggerMiddleware } from './app.middleware';
import { CacheModule } from './cache/cache.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ConfigModule.forRoot(), CacheModule, ApiModule],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          whitelist: true,
        }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer): void {
    if (this.configService.get('DEBUG') === 'true') {
      consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
  }
}
