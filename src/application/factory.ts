/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  InjectableClass,
  OnCreatedApplication,
  OnReadyApplication,
} from '../interfaces';

export class AppFactory {
  private static instance: AppFactory;

  private diApplication!: InjectableClass;

  private diInstances = new Map<InjectableClass, unknown>();

  private diLevels = new Map<InjectableClass, number>();

  /**
   * Создает и инициирует приложение
   */
  public static async create<T>(
    applicationClass: InjectableClass<T>,
  ): Promise<T> {
    if (this.instance) throw new Error('AppInstance created');

    this.instance = new this();

    await this.instance.createApplication<T>(applicationClass);

    return this.getApplication<T>();
  }

  /**
   * Возвращает инстанс корневого класса приложения
   */
  public static getApplication<T>(): T {
    if (!this.instance) throw new Error('Application not created');

    return this.instance.diInstances.get(this.instance.diApplication) as T;
  }

  /**
   * Возвращает инстанс injected-зависимости по ее классу
   */
  public static getInstance<T>(instanceClass: InjectableClass): T {
    if (!this.instance) throw new Error('Application not created');

    if (!this.instance.diInstances.has(instanceClass)) {
      this.instance.constructObject(instanceClass);
    }

    return this.instance.diInstances.get(instanceClass) as T;
  }

  /**
   * Создает инстансы класса приложения и его injected-зависимостей
   */
  private async createApplication<T>(
    appRootClass: InjectableClass<T>,
  ): Promise<void> {
    this.logConsole(`Create application`);

    this.constructObject<T>(appRootClass);
    this.diApplication = appRootClass;

    await this.afterCreatedInstances();

    this.logConsole(`Ready application`);
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
    this.logConsole(`Launch instances onCreatedApplication`);
    for (const level of orderLevels) {
      const handlersCreatedApplications = (levels.get(level) || [])
        .filter((instance) => this.checkOnCreatedApplication(instance))
        .map((instance) => instance.onCreatedApplication());

      if (handlersCreatedApplications.length > 0) {
        await Promise.all(handlersCreatedApplications);
      }
    }

    // потом запускаем обработчики готовности приложения
    this.logConsole(`Launch instances onReadyApplication`);
    for (const level of orderLevels) {
      const handlersReadyApplications = (levels.get(level) || [])
        .filter((instance) => this.checkOnReadyApplication(instance))
        .map((instance) => instance.onReadyApplication());

      if (handlersReadyApplications.length > 0) {
        await Promise.all(handlersReadyApplications);
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
