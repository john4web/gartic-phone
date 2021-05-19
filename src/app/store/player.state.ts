import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { AuthState } from './auth.state';
import { AddPlayer } from './player.actions';

export interface PlayerInterface {
  id: string;
  name: string;
}

export interface PlayerStateModel {
  players: PlayerInterface[];
}


function getDefaultState(): PlayerStateModel {
  return {
    players: []
  };
}

@State<PlayerStateModel>({
  name: 'playerstate',
  defaults: getDefaultState(),
})
@Injectable()
export class PlayerState implements NgxsOnInit {

  @Selector()
  static players(state: PlayerStateModel) {
    return state.players;
  }

  constructor(private angularFireStore: AngularFirestore, private store: Store) {
  }

  ngxsOnInit(context?: StateContext<any>): void {
  }


  @Action(AddPlayer)
  addPlayer(context: StateContext<PlayerStateModel>, action: AddPlayer): void {
    const userId = this.store.selectSnapshot(AuthState.userId);

    const followDoc = this.angularFireStore.collection('games').doc(action.id).ref;

    followDoc.get().then((doc) => {
      if (doc.exists) {
        this.angularFireStore
          .collection('games')
          .doc(action.id)
          .collection<Partial<PlayerInterface>>('players').add(
            {
              id: userId!,
              name: action.name
            });
      } else {
        console.log('this game room does not exits');
      }
    });
  }
}
