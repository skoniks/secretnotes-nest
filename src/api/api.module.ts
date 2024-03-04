import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [ApiController],
})
export class ApiModule {}
