import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {Action, NgxsOnInit, Selector, State, StateContext, Store} from '@ngxs/store';
import { AuthState } from './auth.state';
import { PlayerInterface, PlayerStateModel } from './player.state';
import { CreateRoom, GetRoom } from './room.actions';

export interface RoomInterface{
  host: PlayerInterface;
  players: PlayerInterface [];
}

export interface RoomStateModel{
  room: RoomInterface;
}


function getDefaultState(): RoomStateModel{
  return {
      room: {
        host: {
          id: "",
          name: ""
        },
        players: []
      }
  }
}

@State<RoomStateModel>({
  name: 'roomstate',
  defaults: getDefaultState(),
})
@Injectable()
export class RoomState implements NgxsOnInit {
  @Selector()
  static rooms(state:RoomStateModel) {
    return state.room;
  }

  @Selector()
  static roomId(state:RoomStateModel) {
    return state.room.host.id;
  }

  constructor(private angularFireStore: AngularFirestore, private store: Store){

  }

  ngxsOnInit(context?: StateContext<any>): void {
  }


  @Action(CreateRoom)
  createRoom(context: StateContext<RoomStateModel>, action: CreateRoom): void {
    const userId = this.store.selectSnapshot(AuthState.userId);

    this.angularFireStore
      .collection<RoomInterface>("games")
      .doc(userId!).set({
        host : {
          id: userId!,
          name: action.host
        },
        players: []
      });

  }

}
