import {
  ConsoleLogger,
  ConsoleLoggerOptions,
  Injectable,
  LogLevel,
} from '@nestjs/common';
import cluster from 'cluster';
import { cpus } from 'os';

@Injectable()
export class AppConsole extends ConsoleLogger {
  private id: string;

  constructor(context?: string, options?: ConsoleLoggerOptions) {
    if (context && options) super(context, options);
    else if (context) super(context);
    else super();

    if (cluster.worker?.id !== undefined) {
      const { length } = cpus().length.toString();
      this.id = cluster.worker?.id.toString().padStart(length, ' ');
    } else this.id = '';
  }

  formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string,
  ) {
    const output = this.stringifyMessage(message, logLevel);
    pidMessage = this.colorize(this.id ? `${this.id} | ` : '', logLevel);
    formattedLogLevel = this.colorize(formattedLogLevel.trim(), logLevel);
    return `${pidMessage}${this.getTimestamp()} ${formattedLogLevel} ${contextMessage}${output}${timestampDiff}\n`;
  }
}
