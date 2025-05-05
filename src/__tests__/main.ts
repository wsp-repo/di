import { AppFactory } from '../index';
import { AppService } from './application';
import { extFunction } from './helpers/functions';

async function bootstrap(): Promise<void> {
  await AppFactory.create<AppService>(AppService);
  const app = AppFactory.getApplication<AppService>();

  // Альтернативный вариант
  // const app = await AppFactory.create<AppService>(AppService);

  app.startApplication();

  extFunction();
}

bootstrap().catch((error) => console.error(error));
