# Минималистический DI

## Пример использования

```typescript
// файл service1.ts

import { Injectable } from '@zalib/di';

@Injectable()
export class Service1 {}
```

```typescript
// файл service2.ts

import { Injectable, OnCreatedApplication } from '@zalib/di';
import { Service1 } from './service1';

@Injectable()
export class Service2 implements OnCreatedApplication {
  constructor(private service: Service1) {}

  // Допустимо - public onCreatedApplication(): void {}
  public async onCreatedApplication(): Promise<void> {
    // метод вызывается после создания всех инстансов
    ...
  }

  public publicMethod(): void {}
}
```

```typescript
// файл service3.ts

import { Injectable, OnReadyApplication } from '@zalib/di';
import { Service1 } from './service1';

@Injectable()
export class Service3 implements OnReadyApplication {
  constructor(private service: Service1) {}

  // Допустимо - public onReadyApplication(): void {}
  public async onReadyApplication(): Promise<void> {
    // метод вызывается после готовности приложения
    ...
  }
}
```

```typescript
// файл service4.ts

import { Inject, Injectable, OnReadyApplication } from '@zalib/di';
import { Service1 } from './service1';
import { Service2 } from './service2';

@Injectable()
export class Service4 {
  @Inject(Service1)
  protected service1: Service1;

  constructor(private service2: Service2) {}
}

@Injectable()
export class Service5 {
  constructor(private service2: Service2) {
    super(service2);
    ...
  }

  // в классе проинициализирован this.service1 через свойство родителя
  // без необходимости его проброса в конструкторе через super(...)
}
```

```typescript
// файл application.ts

import { Application } from '@zalib/di';
import { Service2 } from './service2';
import { Service3 } from './service3';
import { Service5 } from './service4';

@Application()
export class AppService {
  constructor(
    private service2: Service2,
    private service3: Service3,
    private service5: Service5,
  ) {}

  // Рабочие методы класса приложения
  public startApplication(): void {
    ...
  }
}
```

```typescript
// файл main.ts

import { AppFactory } from '@zalib/di';
import { AppService } from './application';

async function bootstrap(): Promise<void> {
  await AppFactory.create<AppService>(AppService);
  const app = AppFactory.getApplicationSync<AppService>();

  // Альтернативный вариант
  // const app = await AppFactory.create<AppService>(AppService);

  app.startApplication();
}

bootstrap().catch((error) => console.error(error));
```

```typescript
// файл functions.ts

import { AppFactory } from '@zalib/di';
import { Service2 } from './service2';

function extFunction(): void {
  const service = AppFactory.getInstance<Service2>(Service2);

  // можно работать с injected-инстансом класса Service2
  service.publicMethod();
}
```
