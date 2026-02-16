/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  InjectableClass,
  OnCreatedApplication,
  OnReadyApplication,
} from '../interfaces';

export class AppFactory {
  private static instanceObject: AppFactory;

  private static instanceResolve: (application: AppFactory) => void;

  private static instancePromise = new Promise<AppFactory>((resolve) => {
    this.instanceResolve = resolve;
  });

  private diApplication!: InjectableClass;

  private diInstances = new Map<InjectableClass, unknown>();

  private diLevels = new Map<InjectableClass, number>();

  /**
   * Создает и инициирует приложение
   */
  public static async create<T>(
    applicationClass: InjectableClass<T>,
  ): Promise<T> {
    if (this.instanceObject) throw new Error('AppInstance created');

    this.instanceObject = new this();

    await this.instanceObject.createApplication<T>(applicationClass);

    // необходимо зарезолвить создание инстанса в следующем тике
    setImmediate(() => this.instanceResolve(this.instanceObject));

    return this.getApplicationSync<T>();
  }

  /**
   * Возвращает инстанс корневого класса приложения (промис)
   */
  public static getApplication<T>(): Promise<T> {
    return this.instancePromise.then(() => {
      return this.getApplicationSync<T>();
    });
  }

  /**
   * Возвращает инстанс корневого класса приложения
   */
  public static getApplicationSync<T>(): T {
    this.throwIfNotExistsApplicationInstanceObject();

    return this.instanceObject.diInstances.get(
      this.instanceObject.diApplication,
    ) as T;
  }

  /**
   * Возвращает инстанс injected-зависимости по ее классу (асинк)
   */
  public static getInstance<T>(instanceClass: InjectableClass): Promise<T> {
    return this.instancePromise.then(() => {
      return this.getInstanceSync<T>(instanceClass);
    });
  }

  /**
   * Возвращает инстанс injected-зависимости по ее классу
   */
  public static getInstanceSync<T>(instanceClass: InjectableClass): T {
    this.throwIfNotExistsApplicationInstanceObject();

    if (!this.instanceObject.diInstances.has(instanceClass)) {
      this.instanceObject.constructObject(instanceClass);
    }

    return this.instanceObject.diInstances.get(instanceClass) as T;
  }

  /**
   * Выкидывает исключение, если инстанс приложения отсутсвует
   */
  private static throwIfNotExistsApplicationInstanceObject(): void {
    if (!this.instanceObject) {
      throw new Error('Application not created');
    }
  }

  /**
   * Создает инстансы класса приложения и его injected-зависимостей
   */
  private async createApplication<T>(
    appRootClass: InjectableClass<T>,
  ): Promise<void> {
    this.logConsole('Create application');

    this.constructObject<T>(appRootClass);
    this.diApplication = appRootClass;

    await this.afterCreatedInstances();

    this.logConsole('Ready application');
  }

  /**
   * Вызывает обработчики для всех injected-инстансов
   */
  private async afterCreatedInstances(): Promise<void> {
    const levels = new Map<number, any[]>();

    this.diLevels.forEach((level, constructor) => {
      const instances = levels.get(level) || [];

      instances.push(this.diInstances.get(constructor));
      levels.set(level, instances);
    });

    // порядок обработки уровней должен быть "снизу вверх"
    const orderLevels = [...levels.keys()].sort((l1, l2) => l2 - l1);

    // запускаем сначала обработчики создания приложения
    this.logConsole('Launch instances onCreatedApplication');
    for (const level of orderLevels) {
      const handlersCreated = (levels.get(level) || [])
        .filter((instance) => this.checkOnCreatedApplication(instance))
        .map((instance) => instance.onCreatedApplication());

      if (handlersCreated.length > 0) {
        await Promise.all(handlersCreated as Promise<void>[]);
      }
    }

    // потом запускаем обработчики готовности приложения
    this.logConsole('Launch instances onReadyApplication');
    for (const level of orderLevels) {
      const handlersReady = (levels.get(level) || [])
        .filter((instance) => this.checkOnReadyApplication(instance))
        .map((instance) => instance.onReadyApplication());

      if (handlersReady.length > 0) {
        await Promise.all(handlersReady as Promise<void>[]);
      }
    }
  }

  /**
   * Проверяет инстанс на наличие обработчика OnCreatedApplication
   */
  private checkOnCreatedApplication(
    instance?: any,
  ): instance is OnCreatedApplication {
    return typeof instance?.onCreatedApplication === 'function';
  }

  /**
   * Проверяет инстанс на наличие обработчика OnReadyApplication
   */
  private checkOnReadyApplication(
    instance?: any,
  ): instance is OnReadyApplication {
    return typeof instance?.onReadyApplication === 'function';
  }

  /**
   * Рекурсивно создает инстанс injectable-класса с зависимостями
   */
  private constructObject<T>(constructor: InjectableClass, level = 0): T {
    this.setLevelInjectableClass(constructor, level);

    const args = this.getMetadata(constructor).map((inject) =>
      this.constructObject<typeof inject>(inject, level + 1),
    );

    // Порядок такой, чтобы считать уровень вложенности
    const existsInstance = this.diInstances.get(constructor);

    if (existsInstance) return existsInstance as T;

    const createdInstance = new constructor(...args);
    this.diInstances.set(constructor, createdInstance);

    this.logConsole(`Created instance ${constructor.name}`);

    return createdInstance as T;
  }

  /**
   * Читает injectable мета-параметры injectable-класса
   */
  private getMetadata(constructor: InjectableClass): InjectableClass[] {
    return Reflect.getMetadata('design:paramtypes', constructor) || [];
  }

  /**
   * Переопределяет уровень вложенности injectable-класса
   */
  private setLevelInjectableClass(
    constructor: InjectableClass,
    level: number,
  ): void {
    const currentLevel = this.diLevels.get(constructor);
    const setLevel = Math.max(level, currentLevel || 0);

    this.diLevels.set(constructor, setLevel);
  }

  private logConsole(...args: unknown[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.info(...args);
    }
  }
}
