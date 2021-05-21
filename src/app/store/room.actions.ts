import { RoomInterface, RoomState } from './room.state';

export class CreateRoom {
  static readonly type = 'CreateRoom';

  constructor(public hostName: string) {
  }
}

export class GetRoom {
  static readonly type = 'GetRoom';

  constructor(public id: string) {
  }
}


export class SetRoom {
  static readonly type = 'SetRoom';

  constructor(public room: RoomInterface) {
  }
}

