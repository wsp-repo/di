import { Injectable, OnCreatedApplication } from '../../index';

import { Service1 } from './service1';

@Injectable()
export class Service2 implements OnCreatedApplication {
  constructor(protected service: Service1) {}

  // Допустимо - public onCreatedApplication(): void {}
  public async onCreatedApplication(): Promise<void> {
    // метод вызывается после создания всех инстансов
  }

  public publicMethod(): void {}
}
