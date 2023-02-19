import { Injectable, Injector } from '../index';

import { Level11 } from './level1';
import { Level31, Level32 } from './level3';

@Injectable()
export class Level41 {
  constructor(protected readonly level11: Level11) {}

  public init(): void {
    this.level11.init();

    console.info('Level41 Inited');
  }
}

@Injectable()
export class Main {
  constructor(
    protected readonly level41: Level41,
    protected readonly level31: Level31,
    protected readonly level32: Level32,
  ) {}

  init(): void {
    this.level31.init();
    this.level32.init();
    this.level41.init();

    console.info('INIT');
  }
}

console.warn('MAIN');

async function bootstrap(): Promise<void> {
  const injector = new Injector();
  const main = await injector.getInstance<Main>(Main);
  main.init();
}

bootstrap().catch((error) => console.error(error));
