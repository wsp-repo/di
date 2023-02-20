import { AppFactory } from '../../index';
import { Service2 } from '../services/service2';

export function extFunction(): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const service = AppFactory.getInstance<Service2>(Service2);

  // можно работать с injected-инстансом класса Service2
  service.publicMethod();
}
