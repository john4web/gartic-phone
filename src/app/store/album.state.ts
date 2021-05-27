import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { AddContent, SetAlbum, SetupAlbum, SetupAlbums } from './album.action';
import { AngularFirestore } from '@angular/fire/firestore';
import { RoomInterface, RoomState } from './room.state';
import { PlayerInterface, PlayerState } from './player.state';
import { UserState } from './user.state';
import { tap } from 'rxjs/operators';


export interface AlbumItemInterface {
  content: string;
  playerImage: string;
}

export interface Album {
  playerId: number;
  playerName: string;
  album: AlbumItemInterface[];
  playerImage: string;
}

export interface AlbumStateModel {
  albums: Album[];
}

function getDefaultState(): AlbumStateModel {
  return {
    albums: [],
  };
}

@State<AlbumStateModel>({
  name: 'albumState',
})

@Injectable()
export class AlbumState implements NgxsOnInit {

  constructor(private angularFireStore: AngularFirestore, private store: Store) {
  }


  @Selector()
  static albums(state: AlbumStateModel): Album[] {
    return state.albums;
  }

  static getLastItem(store: Store): string {
    const round = store.selectSnapshot(RoomState.round);
    const thisUserID = store.selectSnapshot(UserState.userId);
    const currentAlbumId = AlbumState.getCurrentAlbumID(store, thisUserID);
    const albums = store.selectSnapshot(AlbumState.albums);

    let item: string;
    albums.forEach(album => {
      if (album.playerId === currentAlbumId) { item = album.album[round - 1].content; }
    });


    return item;
  }

  static getCurrentAlbumID(store: Store, id): number {
    let albumId;
    store.selectSnapshot(PlayerState.players).forEach(player => {
      if (player.id === id) { albumId = player.currentAlbumId; }
    });
    return albumId;
  }

  ngxsOnInit(context?: StateContext<AlbumStateModel>): void { }

  @Action(SetupAlbum)
  setupAlbum(context: StateContext<AlbumStateModel>, action: SetupAlbum): void {
    const players = this.store.selectSnapshot(PlayerState.players);
    const newAlbums: Album[] = [];
    players.forEach(player => {
      const album: Album = {
        playerName: player.name,
        playerId: player.playerId,
        album: [],
        playerImage: player.image,
      };
      newAlbums.push(album);
    });
    this.store.dispatch(new SetupAlbums(newAlbums));

    players.forEach(player => {
      this.angularFireStore
        .collection<RoomInterface>('rooms')
        .doc(this.store.selectSnapshot(RoomState.roomId))
        .collection('players')
        .doc(player.id)
        .collection<AlbumItemInterface>('album')
        .doc(this.store.selectSnapshot(RoomState.round).toString()).set({
          content: '',
          playerImage: player.image,
        }).then(() => {
          this.angularFireStore
            .collection<RoomInterface>('rooms')
            .doc(this.store.selectSnapshot(RoomState.roomId))
            .collection('players')
            .doc(player.id)
            .collection('album')
            .get().subscribe(() => {
              this.angularFireStore
                .collection<RoomInterface>('rooms')
                .doc(this.store.selectSnapshot(RoomState.roomId))
                .collection('players')
                .doc(player.id)
                .collection<AlbumItemInterface>('album')
                .valueChanges({
                })
                .pipe(
                  tap((thisAlbum) => {
                    const newAlbum: Album = {
                      playerName: player.name,
                      playerId: player.playerId,
                      album: thisAlbum,
                      playerImage: player.image,
                    };
                    context?.dispatch(new SetAlbum(newAlbum, player.playerId));
                  })
                )
                .subscribe();
            });
        });
    });
  }

  @Action(SetupAlbums)
  setAlbums(context: StateContext<AlbumStateModel>, action: SetupAlbums): void {
    context.patchState({
      albums: action.albums,
    });
  }


  @Action(SetAlbum)
  setAlbum(context: StateContext<AlbumStateModel>, action: SetAlbum): void {
    const newAlbums = this.store.selectSnapshot(AlbumState.albums);
    newAlbums[action.playerId] = action.album;
    context.patchState({
      albums: newAlbums,
    });
  }

  @Action(AddContent)
  addStoryText(context: StateContext<AlbumStateModel>, action: AddContent): void {

    const roomID = this.store.selectSnapshot(RoomState.roomId);
    const thisUserID = this.store.selectSnapshot(UserState.userId);

    // check where is the current AlbumID
    const currentAlbumId = AlbumState.getCurrentAlbumID(this.store, thisUserID);
    // get the according user
    const user = PlayerState.getPlayerById(this.store, currentAlbumId);
    const ownUser = PlayerState.getPlayerByUserIndex(this.store, thisUserID);

    console.log(ownUser);

    this.angularFireStore
      .collection('rooms')
      .doc(roomID)
      .collection<Partial<PlayerInterface>>('players')
      .doc(user.id.toString())
      .collection<AlbumItemInterface>('album')
      .doc(this.store.selectSnapshot(RoomState.round).toString())
      .set({
        content: action.content,
        playerImage: ownUser.image,
      });
  }

  public getUserId(currentAlbumId): number {
    let userId;
    this.store.selectSnapshot(PlayerState.players).forEach(player => {
      if (player.playerId === currentAlbumId) { userId = player.id; }
    });
    return userId;
  }
}
