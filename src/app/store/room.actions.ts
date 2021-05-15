
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
