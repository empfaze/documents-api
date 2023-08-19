import { Logger, ILogObj } from 'tslog';
import { ILoggerService } from '../../types';
import { injectable } from 'inversify';

@injectable()
export class LoggerService implements ILoggerService {
  public logger: Logger<ILogObj>;

  constructor() {
    this.logger = new Logger({
      hideLogPositionForProduction: true,
    });
  }

  log(...args: unknown[]) {
    this.logger.info(...args);
  }

  error(...args: unknown[]) {
    this.logger.error(...args);
  }

  warn(...args: unknown[]) {
    this.logger.warn(...args);
  }
}
