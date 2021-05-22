import { PlayerInterface } from './player.state';

export class AddPlayer {
  static readonly type = '[Player] AddPlayer';

  constructor(public roomID: string, public newPlayer: PlayerInterface) {
  }
}

export class SetPlayers {
  static readonly type = '[Player] SetPlayers';

  constructor(public players: PlayerInterface[]) {
  }
}

export class AddText {
  static readonly type = '[Player] AddText';

  constructor(public text: string) {
  }
}
