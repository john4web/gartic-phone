import { AlbumInterface } from './album.state';

export class AddContent {
  static readonly type = '[Album] AddContent';

  constructor(public content: string) {
  }
}

export class SetAlbum {
  static readonly type = '[Album] SetAlbum';

  constructor(public album: AlbumInterface[]) {
  }
}
