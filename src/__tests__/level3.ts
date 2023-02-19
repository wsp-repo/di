import { Injectable, OnReadyApplication } from '../index';

import { Level21, Level22 } from './level2';

@Injectable()
export class Level31 implements OnReadyApplication {
  constructor(private level21: Level21, private level22: Level22) {}

  public async onReadyApplication(): Promise<void> {
    console.info('Level31 - onReadyApplication');
    await Promise.resolve();
  }

  public init(): void {
    this.level21.init();
    this.level22.init();

    console.info('Level31 Inited');
  }
}

@Injectable()
export class Level32 {
  constructor(private level11: Level21) {}

  public init(): void {
    this.level11.init();

    console.info('Level32 Inited');
  }
}
