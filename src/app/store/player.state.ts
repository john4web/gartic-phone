import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { of } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import { UserChanged } from './auth.actions';
import { AuthState } from './auth.state';
import { AddPlayer, AddText, SetPlayers } from './player.actions';
import { SetRoom } from './room.actions';
import { RoomInterface, RoomState } from './room.state';
import { SetMyUser } from './user.actions';
import { UserState } from './user.state';

export interface PlayerInterface {
  id: string;
  name: string;
  isHost: boolean;
  image: string;
}

export interface PlayerStateModel {
  players: PlayerInterface[];
}

/*
function getDefaultState(): PlayerStateModel {
  return {
    players: []
  };
}*/

@State<PlayerStateModel>({
  name: 'playerstate',
  // defaults: getDefaultState(),
})
@Injectable()
export class PlayerState implements NgxsOnInit {

  constructor(private angularFireStore: AngularFirestore, private store: Store) {

  }

  @Selector()
  static players(state: PlayerStateModel): PlayerInterface[] {
    return state.players;
  }


  ngxsOnInit(context?: StateContext<any>): void {

    const fireStore = this.angularFireStore;

    this.store
      .select(RoomState.roomId)
      .pipe(
        switchMap((roomId) => {
          if (!roomId) {
            return of(null);
          } else {
            return fireStore
              .collection('rooms')
              .doc(roomId)
              .collection<PlayerInterface>('players')
              .valueChanges({
                idField: 'id',
              })
              .pipe(
                tap((players) => {
                  context?.dispatch(new SetPlayers(players));
                })
              );
          }
        })
      )
      .subscribe();














  }


  @Action(AddPlayer)
  addPlayer(context: StateContext<PlayerStateModel>, action: AddPlayer): void {








    // const userId = this.store.selectSnapshot(AuthState.userId);

    // const followDoc = this.angularFireStore.collection('games').doc(action.id).ref;
    this.angularFireStore
      .collection('rooms')
      .doc(action.roomID)
      .collection<Partial<PlayerInterface>>('players').add(action.newPlayer).then((docRef) => {
        this.store.dispatch(new SetMyUser(docRef.id));
      });


    /* .doc(this.store.selectSnapshot(UserState.userId))
     .set({ name: action.clientName, isHost: action.isHost, image: action.image });*/

    /*this.angularFireStore.collection('rooms')
      .doc(action.pastedRoomID)
      .valueChanges({
        idField: 'id'
      }).subscribe((players) => {
        context?.dispatch(new SetPlayers(players));
      });*/
    /*
        this.store.select(UserState.userId)
          .pipe(
            switchMap(userId => {
              if (userId === null) {
                return of(null);
              } else {
                return this.angularFireStore
                  .collection('rooms')
                  .doc<RoomInterface>(action.pastedRoomID)
                  .valueChanges()
                  .pipe(
                    tap(room => {
                      context?.dispatch(new SetRoom(room));
                    })
                  );
              }
            })
          ).subscribe();


        // listen for changes in firebase collection rooom
        this.store.select(RoomState)
          .pipe(
            switchMap(player => {
              if (player === null) {
                return of(null);
              } else {
                return this.angularFireStore
                  .collection('rooms')
                  .doc(action.pastedRoomID)
                  .collection<PlayerInterface>('players')
                  .valueChanges({
                    idField: 'id'
                  })
                  .pipe(
                    tap(players => {
                      context?.dispatch(new SetPlayers(players));
                    })
                  );
              }
            })
          ).subscribe();




    */




    /*
        followDoc.get().then((doc) => {
          if (doc.exists) {
            this.angularFireStore
              .collection('games')
              .doc(action.)
              .collection<Partial<PlayerInterface>>('players').add(
                {
                  id: userId!,
                  name: action.name
                });
          } else {
            console.log('this game room does not exits');
          }
        });*/
  }


  @Action(SetPlayers)
  setPlayers(context: StateContext<PlayerStateModel>, action: SetPlayers): void {
    context.patchState({
      players: action.players,
    });
  }



  @Action(AddText)
  addText(context: StateContext<PlayerStateModel>, action: AddText): void {
    this.angularFireStore
      .collection('rooms')
      .doc(this.store.selectSnapshot(RoomState.roomId))
      .collection<Partial<PlayerInterface>>('players')
      .doc(this.store.selectSnapshot(UserState.userId))
      .collection('album')
      .doc('1')
      .set(
        {
          text: action.text
        }
      );
  }










}
