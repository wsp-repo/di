import { Injectable, OnReadyApplication } from '../../index';
import { Service4 } from './service4';

@Injectable()
export class Service5 extends Service4 implements OnReadyApplication {
  public onReadyApplication(): void {
    this.service1.method();
  }
}
