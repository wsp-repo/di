import { Injectable, OnCreatedApplication } from '../index';

@Injectable()
export class Level11 {
  public init(): void {
    console.info('Level11 Inited');
  }
}

@Injectable()
export class Level12 implements OnCreatedApplication {
  constructor(private level11: Level11) {}

  public async onCreatedApplication(): Promise<void> {
    console.info('Level12 - onCreatedApplication');
    await Promise.resolve();
  }

  public init(): void {
    this.level11.init();

    console.info('Level12 Inited');
  }
}
