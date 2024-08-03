import { Inject } from '../../index';
import { Service1 } from './service1';

export class Service4 {
  @Inject(Service1)
  protected service1!: Service1;
}
