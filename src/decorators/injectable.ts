/* eslint-disable @typescript-eslint/naming-convention */

import { InjectableClass } from '../interfaces';

/**
 * Декоратор для декларирования Injectable-классов
 */
export function Injectable() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (_target: InjectableClass): void => {
    // const meta = Reflect.getMetadata('design:paramtypes', target);
    // console.info('Injectable : ', target, meta);
  };
}
