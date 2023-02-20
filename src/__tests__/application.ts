import { Application } from '../index';

import { Service2 } from './services/service2';
import { Service3 } from './services/service3';

@Application()
export class AppService {
  constructor(protected service2: Service2, protected service3: Service3) {}

  // Рабочие методы класса приложения
  public startApplication(): void {}
}
