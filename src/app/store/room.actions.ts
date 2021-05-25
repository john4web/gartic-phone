import { RoomInterface, RoomState } from './room.state';

export class CreateRoom {
  static readonly type = '[Room] CreateRoom';

  constructor(public hostName: string, public imagePath: string) {
  }
}

export class GetRoomFromFirestore {
  static readonly type = '[Room] GetRoomFromFirestore';

  constructor(public roomID: string) {
  }
}


export class SetRoom {
  static readonly type = '[Room] SetRoom';

  constructor(public room: RoomInterface) {
  }
}


export class ChangeRoomPage {
  static readonly type = '[Room] ChangeRoomPage';

  constructor(public newPageNUmber: number) {
  }
}

export class UpdateRound {
  static readonly type = '[Room] UpdateRound';

  constructor() {
  }
}

export class UpdateTimer {
  static readonly type = '[Room] UpdateTimer';

  constructor(public newTime: number) {
  }
}
