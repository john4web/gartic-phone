import { CONTEXT_NAME } from '@angular/compiler/src/render3/view/util';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import firebase from 'firebase';
import { UserChanged } from './auth.actions';
import User = firebase.User;

export interface AuthStateModel {
  user: User;
}

@State<AuthStateModel>({
  name: 'authState',
  defaults: {
    user: null,
  }
})

@Injectable()
export class AuthState implements NgxsOnInit {

  constructor(private authService: AngularFireAuth) {

  }

  // allows to easily access the users id
  @Selector()
  static userId(state: AuthStateModel): string | null {
    return state.user?.uid || null;
  }

  ngxsOnInit(context?: StateContext<AuthStateModel>): void {
    this.authService.authState.subscribe(user => {
      // dispatch actions when the user changes
      context?.dispatch(new UserChanged(user));
    });
  }

  @Action(UserChanged)
  userChanged(context: StateContext<AuthStateModel>, action: UserChanged): void {
    // write the user, that the action contains, to the state
    context.patchState({
      user: action.user,
    });
  }
}
