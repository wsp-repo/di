/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  InjectableClass,
  OnCreatedApplication,
  OnReadyApplication,
} from '../interfaces';

export class Injector {
  private diInstances = new Map<InjectableClass, any>();

  private diLevels = new Map<InjectableClass, number>();

  /**
   * Инициирует инстанс приложения и все injected-зависимости
   */
  public async getInstance<T>(constructor: InjectableClass<T>): Promise<T> {
    const instance = this.constructObject<T>(constructor);

    await this.afterCreatedInstances();

    return instance;
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
    for (const level of orderLevels) {
      const handlersCreatedApplications = (levels.get(level) || [])
        .filter((instance) => this.checkOnCreatedApplication(instance))
        .map((instance) => instance.onCreatedApplication());

      if (handlersCreatedApplications.length > 0) {
        await Promise.all(handlersCreatedApplications);
      }
    }

    // потом запускаем обработчики готовности приложения
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

    const args = this.getMetadata(constructor).map((params) =>
      this.constructObject(params, level + 1),
    );

    // Порядок такой, чтобы считать уровень вложенности
    const existsInstance = this.diInstances.get(constructor);

    if (existsInstance) return existsInstance;

    const createdInstance = new constructor(...args);
    this.diInstances.set(constructor, createdInstance);

    return createdInstance;
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
}
