export class AddPlayer {
  static readonly type = 'AddPlayer';

  constructor(public id: string, public name: string) {
  }
}
