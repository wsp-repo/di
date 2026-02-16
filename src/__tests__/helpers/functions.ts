import { AppFactory } from '../../index';
import { Service2 } from '../services/service2';

export async function extFunctionAsync(): Promise<void> {
  const service = await AppFactory.getInstance<Service2>(Service2);

  // можно работать с injected-инстансом класса Service2
  service.publicMethod();
}

export function extFunctionSync(): void {
  const service = AppFactory.getInstanceSync<Service2>(Service2);

  // можно работать с injected-инстансом класса Service2
  service.publicMethod();
}

(async () => {
  console.warn('getApplication call');

  await AppFactory.getApplication();

  console.warn('getApplication end');
})();
