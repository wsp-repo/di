import { Injectable, OnReadyApplication } from '../index';

import { Level11, Level12 } from './level1';

@Injectable()
export class Level21 {
  constructor(private level11: Level11, private level12: Level12) {}

  public init(): void {
    this.level11.init();
    this.level12.init();

    console.info('Level21 Inited');
  }
}

@Injectable()
export class Level22 implements OnReadyApplication {
  constructor(private level21: Level21) {}

  public async onReadyApplication(): Promise<void> {
    console.info('Level22 - onReadyApplication');
    await Promise.resolve();
  }

  public init(): void {
    this.level21.init();

    console.info('Level22 Inited');
  }
}
