import { PlayerInterface } from './player.state';

export class AddPlayer {
  static readonly type = '[Player] AddPlayer';

  constructor(public roomID: string, public newPlayer: PlayerInterface) {
  }
}

export class GetPlayersFromFirestore {
  static readonly type = '[Room] GetPlayersFromFirestore';

  constructor(public roomID: string) {
  }
}

export class SetPlayers {
  static readonly type = '[Player] SetPlayers';

  constructor(public players: PlayerInterface[]) {
  }
}

export class UpdateAlbumId {
  static readonly type = '[Player] UpdateAlbumId';

  constructor() {
  }
}

export class GetCurrentAlbumById {
  static readonly type = '[Player] getAlbumById';
  constructor(public playerId: number) {
  }
}

export class AddText {
  static readonly type = '[Player] AddText';

  constructor(public text: string) {
  }
}
