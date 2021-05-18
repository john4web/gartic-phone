import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { AuthState } from './auth.state';
import { PlayerInterface, PlayerStateModel } from './player.state';
import { CreateRoom, GetRoom } from './room.actions';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AddPlayer } from './player.actions';

export interface RoomInterface {
  createdAt: Date;
  id: string;
}

export interface RoomStateModel {
  room: RoomInterface;
}


function getDefaultState(): RoomStateModel {
  return {
    room: {
      createdAt: new Date(),
      id: ''
    }
  };
}

@State<RoomStateModel>({
  name: 'roomstate',
  defaults: getDefaultState(),
})
@Injectable()
export class RoomState implements NgxsOnInit {

  // allows to easily access the room id
  @Selector()
  static roomId(state: RoomStateModel): string | null {
    return state.room.id || null;
  }

  // @Selector()
  // static roomId(state: RoomStateModel) {
  //   return state.room.host.id;
  // }

  constructor(private angularAuth: AngularFireAuth, private angularFireStore: AngularFirestore, private store: Store) {

  }

  ngxsOnInit(context?: StateContext<any>): void {
  }


  @Action(CreateRoom)
  createRoom(context: StateContext<RoomStateModel>, action: CreateRoom): void {

    this.angularAuth.signOut();
    this.angularAuth.signInAnonymously().then((obj) => {
      const roomID = obj.user?.uid;

      // Adding new room
      this.angularFireStore
        .collection<RoomInterface>('rooms')
        .doc(roomID!).set({
          createdAt: new Date(),
          id: roomID!
        });







      context?.dispatch(new AddPlayer(roomID!, action.hostName, true));

      /*
            // adding the creator of the room as a player to the room
            this.angularFireStore
              .collection<RoomInterface>('rooms')
              .doc(roomID!).collection('players').add({
                name: action.hostName,
                isHost: true
              });
      */

    });




    // console.log(this.store.selectSnapshot(AuthState.userId));
    /* const userId = this.store.selectSnapshot(AuthState.userId);

     this.angularFireStore
       .collection<RoomInterface>("games")
       .doc(userId!).set({
         host : {
           id: userId!,
           name: action.host
         },
         players: []
       });*/

  }



  // @Action(SetRoom)
  // setPlayers(context: StateContext<PlayerStateModel>, action: SetRoom): void {
  //   context.patchState({

  //   });


  // }


}
