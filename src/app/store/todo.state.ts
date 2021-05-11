import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { from, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { AuthState } from './auth.state';
import { AddTodo, SetTodos } from './todo.actions';

export interface TodoInterface {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  done: boolean;
}


export interface TodoStateModel {
  todos: TodoInterface[];
}


function getDefaultState(): TodoStateModel {
  return {
    todos: [],
  };
}


@State<TodoStateModel>({
  name: 'todoState',
  defaults: getDefaultState()
})
@Injectable()
export class TodoState {
  @Selector()
  static todos(state: TodoStateModel): TodoInterface[] {
    // grab out the data from the state and return it
    return state.todos;
  }


  constructor(private angularFirestore: AngularFirestore, private store: Store) {

  }

  ngxsOnInit(context?: StateContext<any>): void {

    // listen for changes in firebase collection


    this.store.select(AuthState.userId)
      .pipe(
        switchMap(userId => {
          if (userId === null) {
            return of(null);
          } else {
            return this.angularFirestore
              .collection('todos')
              .doc(userId)
              .collection<TodoInterface>('items')
              .valueChanges({
                idField: 'id'
              })
              .pipe(
                tap(todos => {
                  context?.dispatch(new SetTodos(todos));
                })
              );
          }

        })
      );

  }


  // Handles the todo action
  @Action(AddTodo)
  addTodo(context: StateContext<TodoStateModel>, action: AddTodo): Observable<any> {

    const now = new Date();

    const userId = this.store.selectSnapshot(AuthState.userId);
    return from(this.angularFirestore.collection('todos').doc(userId).collection<Partial<TodoInterface>>('items').add({
      title: action.title,
      done: false,
      updatedAt: now,
      createdAt: now,
    }));


  }



  @Action(SetTodos)
  setTodos(context: StateContext<TodoStateModel>, action: SetTodos): void {
    context.patchState({
      todos: action.todos,
    });
  }


}
