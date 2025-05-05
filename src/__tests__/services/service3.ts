import { Injectable, OnReadyApplication } from '../../index';
import { Service1 } from './service1';

@Injectable()
export class Service3 implements OnReadyApplication {
  constructor(protected service: Service1) {}

  // Допустимо - public onReadyApplication(): void {}
  public async onReadyApplication(): Promise<void> {
    // метод вызывается после готовности приложения
  }
}
