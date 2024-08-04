import { Injectable } from '../../index';

@Injectable()
export class Service1 {
  public method(): void {
    console.warn('Service1.method');
  }
}
