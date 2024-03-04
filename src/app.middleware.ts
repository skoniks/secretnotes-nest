import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  private hrtimeToMs = (start: [number, number]) => {
    const diff = process.hrtime(start);
    return (diff[0] * 1e9 + diff[1]) / 1e6;
  };

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, originalUrl: url, ip } = request;
    const userAgent = request.get('user-agent') || '$';
    const referer = request.get('referer') || '#';
    const start = process.hrtime();
    response.on('close', () => {
      const { statusCode: status } = response;
      const end = `[${this.hrtimeToMs(start)}ms]`;
      const info = [method, url, status, '-', userAgent, referer, ip, end];
      this.logger.verbose(info.join(' '));
    });
    next();
  }
}
