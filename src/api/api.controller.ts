import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Readable } from 'stream';
import { CacheService } from '../cache/cache.service';
import { DownloadDto } from './dto/download-dto';
import { UploadDto } from './dto/upload-dto';

@Controller('api')
export class ApiController {
  constructor(private cacheService: CacheService) {}

  @Get()
  @Post()
  async download(
    @Body() { id, secret }: DownloadDto,
    @Res() response: Response,
  ) {
    const cache = await this.cacheService.hgetall(`list:${id}`);
    if (!cache.data || cache.secret !== secret) throw new NotFoundException();
    await this.cacheService.del(`list:${id}`);
    response.set({
      'Content-Type': cache.type,
      'Content-Disposition': 'attachment',
    });
    Readable.from(cache.data).pipe(response);
  }

  @Put()
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body() { secret, expire, compact }: UploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const id = await this.getNextID(compact);
    await this.cacheService.hset(`list:${id}`, {
      secret,
      type: file.mimetype,
      data: file.buffer.toString('base64'),
    });
    await this.cacheService.expire(`list:${id}`, expire);
    return id;
  }

  private async getNextID(compact: boolean) {
    if (!compact) return crypto.randomUUID();
    const index = await this.cacheService.get('index');
    const next = (parseInt(index ?? '') || 19440) + 1;
    await this.cacheService.set('index', next);
    return next.toString(36);
  }
}
