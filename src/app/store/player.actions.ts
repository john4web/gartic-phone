import { PlayerInterface } from './player.state';

export class AddPlayer {
  static readonly type = '[Player] AddPlayer';

  constructor(public pastedRoomID: string, public clientName: string, public isHost: boolean) {
  }
}


export class SetPlayers {
  static readonly type = '[Player] SetPlayers';

  constructor(public players: PlayerInterface[]) {
  }
}
