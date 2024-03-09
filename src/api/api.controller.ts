import {
  Body,
  Controller,
  NotFoundException,
  Post,
  Put,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { Readable } from 'stream';
import { CacheService } from '../cache/cache.service';
import { DownloadDto } from './dto/download-dto';
import { UploadDto } from './dto/upload-dto';

@Controller('api')
export class ApiController {
  constructor(private cacheService: CacheService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async download(
    @Body() { id, secret }: DownloadDto,
    @Res() response: Response,
  ) {
    const cache = await this.cacheService.hgetall(`list:${id}`);
    if (!cache.data || cache.secret !== secret) throw new NotFoundException();
    await this.cacheService.del(`list:${id}`);
    const data = Buffer.from(cache.data, 'base64');
    response.set({
      'Content-Type': cache.type,
      'Content-Length': data.byteLength,
      'Content-Disposition': 'attachment',
    });
    Readable.from(data).pipe(response);
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

  private async getNextID(compact: boolean): Promise<string> {
    if (!compact) return crypto.randomUUID();
    return (Date.now() % 259200).toString(36);
    // const index = await this.cacheService.get('index');
    // const next = (parseInt(index ?? '') || 19440) + 1;
    // await this.cacheService.set('index', next);
    // return next.toString(36);
  }
}
