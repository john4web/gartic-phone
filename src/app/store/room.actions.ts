import { PlayerInterface } from "./player.state";
import { RoomInterface } from "./room.state";

export class CreateRoom {
  static readonly type = 'CreateRoom';

  constructor(public host: string) {
  }
}

export class GetRoom {
  static readonly type = 'GetRoom';

  constructor(public id: string){
  }
}

export class SetRoom {
  static readonly type = 'SetRoom';
  constructor(public room: RoomInterface){
  }
}

export class SetRoomPlayers {
  static readonly type = 'SetRoomPlayers';

  constructor(public players: PlayerInterface[]) {
  }
}
