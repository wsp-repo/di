
# Минималистический DI


## Пример использования

```typescript
// файл service1.ts

import { Injectable } from '@wspro/di';

@Injectable()
export class Service1 {}
```


```typescript
// файл service2.ts

import { Injectable, OnCreatedApplication } from '@wspro/di';
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

import { Injectable, OnReadyApplication } from '@wspro/di';
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
// файл application.ts

import { Application } from '@wspro/di';
import { Service2 } from './service2';
import { Service3 } from './service3';

@Application()
export class AppService {
  constructor(
    private service2: Service2,
    private service3: Service3,
  ) {}

  // Рабочие методы класса приложения
  public startApplication(): void {
    ...
  }
}
```

```typescript
// файл main.ts

import { AppFactory } from '@wspro/di';
import { AppService } from './application';

async function bootstrap(): Promise<void> {
  await AppFactory.create<AppService>(AppService);
  const app = AppFactory.getApplication<AppService>();

  // Альтернативный вариант
  // const app = await AppFactory.create<AppService>(AppService);

  app.startApplication();
}

bootstrap().catch((error) => console.error(error));

```


```typescript
// файл functions.ts

import { AppFactory } from '@wspro/di';
import { Service2 } from './service2';

function extFunction(): void {
  const service = AppFactory.getInstance<Service2>(Service2);

  // можно работать с injected-инстансом класса Service2
  service.publicMethod();
}
```
