import { Inject, Injectable } from '../../index';
import { InjectService } from './injectService';
import { Service2 } from './service2';

@Injectable()
export class Service4 {
  @Inject(InjectService)
  protected readonly injectService!: InjectService;

  constructor(protected readonly service2: Service2) {}
}
