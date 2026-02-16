import { AppFactory } from '../index';
import { AppService } from './application';
import { extFunctionSync, extFunctionAsync } from './helpers/functions';

async function bootstrap(): Promise<void> {
  await AppFactory.create<AppService>(AppService);
  const app = AppFactory.getApplicationSync<AppService>();

  // Альтернативный вариант
  // const app = await AppFactory.create<AppService>(AppService);

  app.startApplicationMethod();

  await extFunctionAsync();

  extFunctionSync();
}

bootstrap().catch((error) => console.error(error));
