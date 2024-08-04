import { InjectableClass } from '../interfaces';

export function Application() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (_target: InjectableClass): void => {
    // const meta = Reflect.getMetadata('design:paramtypes', target);
    // console.info('Injectable : ', target, meta);
  };
}
