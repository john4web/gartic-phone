import { Injectable } from '@angular/core';
import { Action, NgxsOnInit, Selector, State, StateContext } from '@ngxs/store';
import { v4 as uuid } from 'uuid';
import { SetMyUser } from './user.actions';

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
    context?.dispatch(new SetMyUser());
  }

  @Action(SetMyUser)
  setMyUser(context: StateContext<UserStateModel>, action: SetMyUser): void {
    // write the user, that the action contains, to the state
    const id = uuid();
    context.patchState({
      user: id,
    });
  }
}
