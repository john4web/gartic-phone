import { AlbumInterface } from './album.state';

export class AddStoryText {
  static readonly type = '[Album] AddStoryText';

  constructor(public storyText: string) {
  }
}

export class SetAlbum {
  static readonly type = '[Album] SetAlbum';

  constructor(public album: AlbumInterface[]) {
  }
}
