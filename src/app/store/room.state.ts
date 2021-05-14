import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {Action, Selector, State, StateContext} from '@ngxs/store';
import { CreateRoom } from './room.actions';

export interface RoomInterface{
  id: string;
  host: string;
  players: string[];
}

export interface RoomStateModel{
  rooms: RoomInterface[];
}


function getDefaultState(): RoomStateModel{
  return {
    	rooms: []
  }
}

@State<RoomStateModel>({
  name: 'roomstate',
  defaults: getDefaultState(),
})
@Injectable()
export class RoomState {
  @Selector()
  static rooms(state:RoomStateModel) {
    return state.rooms;
  }

  constructor(private angularFireStore: AngularFirestore){

  }

  ngxsOnInit(context?: StateContext<any>): void {
  }

  @Action(CreateRoom)
  createRoom(context: StateContext<RoomStateModel>, action: CreateRoom): void {
    console.log('action', action);

    const rooms = [...context.getState().rooms];
    rooms.push({
      id : "0",
      host: action.host,
      players: [action.host]
    });

    context.patchState({
      rooms,
    });

  }
}
