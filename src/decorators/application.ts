/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { InjectableClass } from '../interfaces';

export function Application() {
  return (_target: InjectableClass): void => {
    // const meta = Reflect.getMetadata('design:paramtypes', target);
    // console.info('Injectable : ', target, meta);
  };
}
