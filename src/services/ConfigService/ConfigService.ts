import { config, DotenvParseOutput } from 'dotenv';
import { IConfigService, ILoggerService, INVERSIFY_TYPES } from '../../types';
import { inject, injectable } from 'inversify';

@injectable()
export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor(
    @inject(INVERSIFY_TYPES.LoggerService)
    private loggerService: ILoggerService,
  ) {
    const result = config();

    if (result.error) {
      this.loggerService.error(
        '[ConfigService] An error occured while reading ".env" file',
      );
    } else {
      this.loggerService.log(
        '[ConfigService] Config file ".env" downloaded successfully',
      );
      this.config = result.parsed!;
    }
  }

  get(key: string): string {
    return this.config[key];
  }
}
