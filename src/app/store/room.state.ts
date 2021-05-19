import { state } from '@angular/animations';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { from, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthState } from './auth.state';
import { SetPlayers } from './player.actions';
import { PlayerInterface, PlayerState, PlayerStateModel } from './player.state';
import { CreateRoom, GetRoom, SetRoom, SetRoomPlayers } from './room.actions';

export interface RoomInterface {
  host: PlayerInterface;
  players: PlayerInterface[];
}

export interface RoomStateModel {
  room: RoomInterface;
}


function getDefaultState(): RoomStateModel {
  return {
    room: {
      host: {
        id: '',
        name: ''
      },
      players: []
    }
  };
}

@State<RoomStateModel>({
  name: 'roomstate',
  defaults: getDefaultState(),
})
@Injectable()
export class RoomState implements NgxsOnInit {
  @Selector()
  static room(state: RoomStateModel) {
    return state.room;
  }

  @Selector()
  static roomId(state: RoomStateModel) {
    return state.room.host.id;
  }

  constructor(private angularFireStore: AngularFirestore, private store: Store) {

  }

  ngxsOnInit(context?: StateContext<any>): void {
  }

  @Action(CreateRoom)
  createRoom(context: StateContext<RoomStateModel>, action: CreateRoom): void {
    const newGame =
      this.angularFireStore.collection<RoomInterface>('games').doc(this.store.selectSnapshot(AuthState.userId));

    newGame.set({
      host: {
        id: this.store.selectSnapshot(AuthState.userId),
        name: action.host
      },
      players: []
    });

    newGame.collection<PlayerInterface>('players').add(
      {
        id: this.store.selectSnapshot(AuthState.userId),
        name: action.host
      });

    this.store.select(AuthState.userId)
      .pipe(
        switchMap(userId => {
          if (userId === null) {
            return of(null);
          } else {
            return this.angularFireStore
              .collection<RoomInterface>('games')
              .doc(userId)
              .valueChanges().pipe(
                tap(room => {
                  context.dispatch(new SetRoom(room));
                })
              );
          }
        }),
      )
      .subscribe();


    this.store.select(AuthState.userId)
      .pipe(
        switchMap(userId => {
          if (userId === null) {
            return of(null);
          } else {
            return this.angularFireStore
              .collection<RoomInterface>('games')
              .doc(userId)
              .collection<PlayerInterface>('players')
              .valueChanges().pipe(
                tap(players => {
                  context.dispatch(new SetRoomPlayers(players));
                })
              );
          }
        }),
      )
      .subscribe();


  }

  @Action(SetRoom)
  setRoom(context: StateContext<RoomStateModel>, action: SetRoom): void {
    context.patchState({
      room: action.room,
    });
  }

  @Action(SetRoomPlayers)
  setRoomPlayers(context: StateContext<PlayerStateModel>, action: SetRoomPlayers): void {
    context.patchState({
      players: action.players,
    });
    console.log('players + ' + this.store.selectSnapshot(RoomState.room).players.length);
  }

}
