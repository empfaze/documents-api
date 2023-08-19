import 'reflect-metadata';
import { Container, ContainerModule, interfaces } from 'inversify';
import { App } from './app';
import { ExceptionFilter } from './filters';
import {
  IConfigService,
  IDocumentsController,
  IExceptionFilter,
  ILoggerService,
  INVERSIFY_TYPES,
  ITemplatesController,
} from './types';
import {
  ConfigService,
  DatabaseService,
  LoggerService,
  TemplatesService,
} from './services';
import { DocumentsController, TemplatesController } from './controllers';

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
  bind<ILoggerService>(INVERSIFY_TYPES.LoggerService)
    .to(LoggerService)
    .inSingletonScope();
  bind<IExceptionFilter>(INVERSIFY_TYPES.ExceptionFilter)
    .to(ExceptionFilter)
    .inSingletonScope();
  bind<IConfigService>(INVERSIFY_TYPES.ConfigService)
    .to(ConfigService)
    .inSingletonScope();
  bind<IDocumentsController>(INVERSIFY_TYPES.DocumentsController)
    .to(DocumentsController)
    .inSingletonScope();
  bind<ITemplatesController>(INVERSIFY_TYPES.TemplatesController)
    .to(TemplatesController)
    .inSingletonScope();
  bind<DatabaseService>(INVERSIFY_TYPES.DatabaseService)
    .to(DatabaseService)
    .inSingletonScope();
  bind<TemplatesService>(INVERSIFY_TYPES.TemplatesService)
    .to(TemplatesService)
    .inSingletonScope();
  bind<App>(INVERSIFY_TYPES.Application).to(App);
});

const appContainer = new Container();
appContainer.load(appBindings);

const app = appContainer.get<App>(INVERSIFY_TYPES.Application);
app.init();
