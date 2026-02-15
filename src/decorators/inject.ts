/* eslint-disable @typescript-eslint/naming-convention */

import { AppFactory } from '../application/factory';
import { throwSetter } from '../helpers';

import { InjectableClass } from '../interfaces';

/**
 * Декоратор для присваивания Inject-свойств
 */
export function Inject<T extends InjectableClass>(injectClass: T) {
  return (target: object, propertyKey: string): void => {
    const attr = {
      get: () => AppFactory.getInstance<T>(injectClass),
      set: throwSetter,
    };

    Object.defineProperty(target, propertyKey, attr);
  };
}
