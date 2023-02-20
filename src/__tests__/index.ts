/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Application,
  Injectable,
  AppFactory,
  OnReadyApplication,
} from '../index';

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

@Application()
export class Main implements OnReadyApplication {
  constructor(
    protected readonly level41: Level41,
    protected readonly level31: Level31,
    protected readonly level32: Level32,
  ) {}

  public onReadyApplication(): void {
    console.warn('APPLICATION FULL READY');
  }

  init(): void {
    this.level31.init();
    this.level32.init();
    this.level41.init();

    console.info('INIT');
  }
}

console.warn('MAIN');

async function bootstrap(): Promise<void> {
  const app = await AppFactory.create<Main>(Main);

  app.init();
}

bootstrap().catch((error) => console.error(error));
