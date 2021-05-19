import { PlayerInterface } from "./player.state";

export class AddPlayer {
  static readonly type = 'AddPlayer';

  constructor(public id: string, public name: string) {
  }
}


export class SetPlayers {
  static readonly type = 'SetPlayers';

  constructor(public players: PlayerInterface[]) {
  }
}
