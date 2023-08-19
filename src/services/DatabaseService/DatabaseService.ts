import { DataSource } from 'typeorm';
import { inject, injectable } from 'inversify';
import { IConfigService, ILoggerService, INVERSIFY_TYPES } from '../../types';
import {
  Template,
  TemplateAttributeField,
  Document,
  DocumentAttributeField,
} from '../../entities';

@injectable()
export class DatabaseService {
  client: DataSource;

  constructor(
    @inject(INVERSIFY_TYPES.LoggerService)
    private loggerService: ILoggerService,
    @inject(INVERSIFY_TYPES.ConfigService)
    private configService: IConfigService,
  ) {
    this.client = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: this.configService.get('USERNAME'),
      password: this.configService.get('PASSWORD'),
      database: this.configService.get('DB_NAME'),
      synchronize: true,
      logging: true,
      entities: [
        Template,
        TemplateAttributeField,
        Document,
        DocumentAttributeField,
      ],
    });
  }

  async connect() {
    try {
      await this.client.initialize();

      this.loggerService.log(
        '[DatabaseService] Database has been successfully connected',
      );
    } catch (err) {
      if (err instanceof Error) {
        this.loggerService.error(
          `[DatabaseService] An error occured while connecting to database: ${err.message}`,
        );
      }
    }
  }

  async disconnect() {
    await this.client.destroy();
  }
}
