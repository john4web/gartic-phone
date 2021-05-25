import { Album, AlbumStateModel } from './album.state';


export class InitAlbum {
  static readonly type = '[Album] InitAblum';

  constructor(public playerId: number) {
  }
}


export class AddContent {
  static readonly type = '[Album] AddContent';

  constructor(public content: string) {
  }
}

export class SetAlbum {
  static readonly type = '[Album] SetAlbum';

  constructor(public album: Album, public playerId: number) {
  }
}

export class GetLastItem {
  static readonly type = '[Album] GetAlbum';

  constructor() {
  }
}

export class SetupAlbums {
  static readonly type = '[Album] SetupAlbums';

  constructor(public albums: Album[]) {
  }
}

export class SetupAlbum {
  static readonly type = '[Album] SetupAlbum';

  constructor() {
  }
}

