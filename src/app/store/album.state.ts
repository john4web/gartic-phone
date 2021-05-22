import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import firebase from 'firebase';
import { v4 as uuid } from 'uuid';
import User = firebase.User;
import { SetMyUser } from './user.actions';
import { AddStoryText, SetAlbum } from './album.action';
import { AngularFirestore } from '@angular/fire/firestore';
import { RoomState } from './room.state';
import { PlayerInterface } from './player.state';
import { UserState } from './user.state';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';


export interface AlbumInterface {
  storyStartText: string;
}


export interface AlbumStateModel {
  user: AlbumInterface;
}

@State<AlbumStateModel>({
  name: 'albumState',
})

@Injectable()
export class AlbumState implements NgxsOnInit {

  constructor(private angularFireStore: AngularFirestore, private store: Store) {
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

  /*  @Action(SetAlbum)
    setMyUser(context: StateContext<UserStateModel>, action: SetMyUser): void {
      // write the user, that the action contains, to the state
      context.patchState({
        user: action.userID,
      });
    }*/

  @Action(AddStoryText)
  addStoryText(context: StateContext<AlbumStateModel>, action: AddStoryText): void {

    const roomID = this.store.selectSnapshot(RoomState.roomId);
    const userID = this.store.selectSnapshot(UserState.userId);

    this.angularFireStore
      .collection('rooms')
      .doc(roomID)
      .collection<Partial<PlayerInterface>>('players')
      .doc(userID)
      .collection('album')
      .add({ storyStartText: action.storyText });







  }
}
