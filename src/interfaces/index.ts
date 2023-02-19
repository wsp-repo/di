export interface InjectableClass<T = any> {
  new (...args: any[]): T;
}

export interface OnCreatedApplication {
  onCreatedApplication: () => Promise<void>;
}

export interface OnReadyApplication {
  onReadyApplication: () => Promise<void>;
}
