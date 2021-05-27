import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { AddPlayer, AddText, Finished, GetPlayersFromFirestore, SetPlayers, UpdateAlbumId, UpdatePlayerIDs } from './player.actions';
import { UpdateRound } from './room.actions';
import { RoomInterface, RoomState } from './room.state';
import { UserState } from './user.state';

export interface PlayerInterface {
  id: string;
  playerId: number;
  name: string;
  isHost: boolean;
  image: string;
  currentAlbumId: number;
  finished: boolean;
}

export interface PlayerStateModel {
  players: PlayerInterface[];
}

@State<PlayerStateModel>({
  name: 'playerstate',
})
@Injectable()
export class PlayerState implements NgxsOnInit {

  constructor(private angularFireStore: AngularFirestore, private store: Store) {
  }

  @Selector()
  static players(state: PlayerStateModel): PlayerInterface[] {
    return state.players;
  }


  @Selector()
  static playerCount(state: PlayerStateModel): number {
    return state.players.length;
  }

  static getPlayerById(store: Store, id: number): PlayerInterface {
    let thisPlayer: PlayerInterface;
    store.selectSnapshot(PlayerState.players).forEach(player => {
      if (player.playerId === id) { thisPlayer = player; }
    });
    return thisPlayer;
  }

  static getPlayerByUserIndex(store: Store, id: string): PlayerInterface {
    let thisPlayer: PlayerInterface;
    store.selectSnapshot(PlayerState.players).forEach(player => {
      if (player.id === id) { thisPlayer = player; }
    });
    return thisPlayer;
  }

  ngxsOnInit(context?: StateContext<any>): void { }

  @Action(AddPlayer)
  addPlayer(context: StateContext<PlayerStateModel>, action: AddPlayer): void {
    this.angularFireStore
      .collection('rooms')
      .doc(action.roomID)
      .collection<Partial<PlayerInterface>>('players')
      .doc(this.store.selectSnapshot(UserState.userId))
      .set(action.newPlayer);
  }

  @Action(GetPlayersFromFirestore)
  getPlayersFromFirestore(context: StateContext<PlayerStateModel>, action: GetPlayersFromFirestore): void {
    this.angularFireStore
      .collection<RoomInterface>('rooms')
      .doc(action.roomID)
      .collection('players')
      .get().subscribe(() => {
        this.angularFireStore
          .collection<RoomInterface>('rooms')
          .doc(action.roomID)
          .collection<PlayerInterface>('players')
          .valueChanges({
          })
          .pipe(
            tap((players) => {
              context?.dispatch(new SetPlayers(players));
            })
          )
          .subscribe();
      });
  }

  @Action(UpdatePlayerIDs)
  updatePlayerIDs(context: StateContext<PlayerStateModel>, action: UpdatePlayerIDs): void {
    let count = 0;
    this.store.selectSnapshot(PlayerState.players).forEach(player => {
      this.angularFireStore
        .collection<RoomInterface>('rooms')
        .doc(this.store.selectSnapshot(RoomState.roomId))
        .collection('players')
        .doc<Partial<PlayerInterface>>(player.id)
        .update({
          playerId: count,
          currentAlbumId: count
        });
      count++;
    });
  }


  @Action(SetPlayers)
  setPlayers(context: StateContext<PlayerStateModel>, action: SetPlayers): void {
    context.patchState({
      players: action.players,
    });
    if (this.store.selectSnapshot(RoomState.currentPage) === 1) {
      let finishedCount = 0;
      action.players.forEach(player => {
        if (player.finished) { finishedCount++; }
      });
      if (finishedCount === action.players.length &&
        this.store.selectSnapshot(RoomState.roomId) === this.store.selectSnapshot(UserState.userId)) {
        action.players.forEach(player => {
          this.store.dispatch(new Finished(player.id, false));
        });
        this.store.dispatch(new UpdateAlbumId());
        this.store.dispatch(new UpdateRound());
      }
    }
  }

  @Action(UpdateAlbumId)
  updateAlbumId(context: StateContext<PlayerStateModel>, action: UpdateAlbumId): void {
    this.store.selectSnapshot(PlayerState.players).forEach(player => {
      this.angularFireStore
        .collection('rooms')
        .doc(this.store.selectSnapshot(RoomState.roomId))
        .collection<Partial<PlayerInterface>>('players')
        .doc(player.id).update({
          currentAlbumId: this.getNextCurrentAlbumById(player.playerId),
        });
    });
  }

  getNextCurrentAlbumById(playerId): number {
    let albumId;
    this.store.selectSnapshot(PlayerState.players).forEach(player => {
      if (player.playerId === playerId) { albumId = player.currentAlbumId; }
    });
    if (albumId < this.store.selectSnapshot(PlayerState.playerCount) - 1) {
      albumId++;
    } else {
      albumId = 0;
    }
    return albumId;
  }

  @Action(Finished)
  finished(context: StateContext<PlayerStateModel>, action: Finished): void {
    this.angularFireStore
      .collection('rooms')
      .doc(this.store.selectSnapshot(RoomState.roomId))
      .collection<Partial<PlayerInterface>>('players')
      .doc(action.id)
      .update({
        finished: action.finished,
      });
  }


  @Action(AddText)
  addText(context: StateContext<PlayerStateModel>, action: AddText): void {
    this.angularFireStore
      .collection('rooms')
      .doc(this.store.selectSnapshot(RoomState.roomId))
      .collection<Partial<PlayerInterface>>('players')
      .doc(this.store.selectSnapshot(UserState.userId))
      .collection('album')
      .doc('1')
      .set(
        {
          text: action.text
        }
      );
  }
}
