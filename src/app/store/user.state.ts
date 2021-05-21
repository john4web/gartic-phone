import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import firebase from 'firebase';
import { v4 as uuid } from 'uuid';
import User = firebase.User;
import { Changed } from './user.actions';

export interface UserStateModel {
  user: string;
}

@State<UserStateModel>({
  name: 'userState',
  defaults: {
    user: '',
  }
})

@Injectable()
export class UserState implements NgxsOnInit {

  constructor() {
  }

  // allows to easily access the users id
  @Selector()
  static userId(state: UserStateModel): string {
    return state.user;
  }

  ngxsOnInit(context?: StateContext<UserStateModel>): void {
    const id = uuid();
    context?.dispatch(new Changed(id));
  }

  @Action(Changed)
  userChanged(context: StateContext<UserStateModel>, action: Changed): void {
    // write the user, that the action contains, to the state
    context.patchState({
      user: action.user,
    });
  }
}