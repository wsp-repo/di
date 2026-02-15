/* eslint-disable @typescript-eslint/no-explicit-any */

export interface InjectableClass<T = unknown> {
  new (...args: any[]): T;
}

export interface OnCreatedApplication {
  onCreatedApplication: () => void | Promise<void>;
}

export interface OnReadyApplication {
  onReadyApplication: () => void | Promise<void>;
}
