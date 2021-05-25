import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import firebase from 'firebase';
import { v4 as uuid } from 'uuid';
import User = firebase.User;
import { SetMyUser } from './user.actions';
import { AddContent, GetLastItem, SetAlbum, SetupAlbum, SetupAlbums } from './album.action';
import { AngularFirestore } from '@angular/fire/firestore';
import { RoomInterface, RoomState } from './room.state';
import { PlayerInterface, PlayerState } from './player.state';
import { UserState } from './user.state';
import { switchMap, tap } from 'rxjs/operators';
import { from, Observable, of } from 'rxjs';


export interface AlbumItemInterface {
  content: string;
}

export interface Album {
  playerId: number;
  album: AlbumItemInterface[];
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


  /*
    // allows to easily access the users id
    @Selector()
    static userId(state: UserStateModel): string {
      return state.user;
    }
  */
  ngxsOnInit(context?: StateContext<AlbumStateModel>): void {

    // Todo: Listen on Album Changes in firestore

  }

  @Action(SetupAlbum)
  setupAlbum(context: StateContext<AlbumStateModel>, action: SetupAlbum): void {
    const players = this.store.selectSnapshot(PlayerState.players);
    const newAlbums: Album[] = [];
    players.forEach(player => {
      const album: Album = {
        playerId: player.playerId,
        album: [],
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
          content: ''
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
                      playerId: player.playerId,
                      album: thisAlbum,
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
    console.log(newAlbums);
    context.patchState({
      albums: newAlbums,
    });
  }

  /*
  @Action(GetLastItem)
  getLastItem(context: StateContext<string>, action: GetLastItem): any {
    const round = this.store.selectSnapshot(RoomState.round);
    const thisUserID = this.store.selectSnapshot(UserState.userId);
    const currentAlbumId = this.getCurrentAlbumID(thisUserID);
    const albums = this.store.selectSnapshot(AlbumState.albums);

    let item: string;
    albums.forEach(album => {
      if (album.playerId === currentAlbumId) { item = album.album[round - 1].content; }
    });

    console.log(item);
    return item;
  }
  */


  @Action(AddContent)
  addStoryText(context: StateContext<AlbumStateModel>, action: AddContent): void {

    const roomID = this.store.selectSnapshot(RoomState.roomId);
    const thisUserID = this.store.selectSnapshot(UserState.userId);

    // check where is the current AlbumID
    const currentAlbumId = AlbumState.getCurrentAlbumID(this.store, thisUserID);
    // get the according user
    const userID = this.getUserId(currentAlbumId);

    this.angularFireStore
      .collection('rooms')
      .doc(roomID)
      .collection<Partial<PlayerInterface>>('players')
      .doc(userID.toString())
      .collection('album')
      .doc(this.store.selectSnapshot(RoomState.round).toString())
      .set({ content: action.content });
  }

  public getUserId(currentAlbumId): number {
    let userId;
    this.store.selectSnapshot(PlayerState.players).forEach(player => {
      if (player.playerId === currentAlbumId) { userId = player.id; }
    });
    return userId;
  }
}
