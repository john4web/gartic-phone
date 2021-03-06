import { Injectable, NgZone } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { PlayerInterface, PlayerState } from './player.state';
import { ChangeAlbumIndex, ChangeRoomPage, CreateRoom, DeleteRoom, GetRoomFromFirestore, SetRoom, UpdateRound } from './room.actions';
import { AddPlayer } from './player.actions';
import { UserState } from './user.state';
import { Router } from '@angular/router';
import { SetupAlbum } from './album.action';

export interface RoomInterface {
  id: string;
  page: number;
  createdAt: Date;
  round: number;
  albumIndex: number;
}

export interface RoomStateModel {
  room: RoomInterface;
}

@State<RoomStateModel>({
  name: 'roomstate',
})
@Injectable()
export class RoomState implements NgxsOnInit {

  // allows to easily access the room id
  @Selector()
  static roomId(state: RoomStateModel): string | null {
    return state.room.id || null;
  }

  @Selector()
  static round(state: RoomStateModel): number {
    return state.room.round;
  }

  @Selector()
  static albumIndex(state: RoomStateModel): number {
    return state.room.albumIndex;
  }

  @Selector()
  static currentPage(state: RoomStateModel): number {
    return state.room.page;
  }



  constructor(private router: Router, private angularFireStore: AngularFirestore, private store: Store, private ngZone: NgZone) {

  }

  ngxsOnInit(context?: StateContext<any>): void {

  }


  @Action(CreateRoom)
  createRoom(context: StateContext<RoomStateModel>, action: CreateRoom): void {
    const authID = this.store.selectSnapshot(UserState.userId);

    this.angularFireStore
      .collection<RoomInterface>('rooms')
      .doc(authID).set({
        id: authID,
        page: 0,
        createdAt: new Date(),
        round: 0,
        albumIndex: 0,
      })
      .then(() => {
        console.log('done');

      }).then(() => {

        // gets the room from firestore and syncs it to the ngxs store
        this.store.dispatch(new GetRoomFromFirestore(authID));

        // adding the host as a new player to the room

        const newPlayer: PlayerInterface = {
          id: this.store.selectSnapshot(UserState.userId),
          playerId: 0,
          name: action.hostName,
          isHost: true,
          image: action.imagePath,
          currentAlbumId: 0,
          finished: false,
        };

        this.store.dispatch(new AddPlayer(authID, newPlayer));

      });

  }

  @Action(GetRoomFromFirestore)
  getRoomFromFirestore(context: StateContext<RoomStateModel>, action: GetRoomFromFirestore): void {

    this.angularFireStore
      .collection<RoomInterface>('rooms')
      .doc(action.roomID)
      .get().subscribe(() => {
        this.angularFireStore
          .collection<RoomInterface>('rooms')
          .doc(action.roomID)
          .valueChanges({
            idField: 'id',
          })
          .subscribe((newRoom) => {
            this.store.dispatch(new SetRoom(newRoom));
          });
      });

  }



  @Action(ChangeRoomPage)
  changeRoomPage(context: StateContext<RoomStateModel>, action: ChangeRoomPage): void {

    const roomId = this.store.selectSnapshot(RoomState.roomId);

    this.angularFireStore
      .collection<RoomInterface>('rooms')
      .doc(roomId).update({
        page: action.newPageNUmber
      });
  }

  @Action(ChangeAlbumIndex)
  changeAlbumIndex(context: StateContext<RoomStateModel>, action: ChangeAlbumIndex): void {
    const roomId = this.store.selectSnapshot(RoomState.roomId);
    this.angularFireStore
      .collection<RoomInterface>('rooms')
      .doc(roomId).update({
        albumIndex: action.newIndex
      });
  }

  @Action(DeleteRoom)
  deleteRoom(context: StateContext<RoomStateModel>, action: DeleteRoom): void {
    this.angularFireStore
      .collection<RoomInterface>('rooms')
      .doc(this.store.selectSnapshot(RoomState.roomId)).delete();
  }

  @Action(UpdateRound)
  updateRound(context: StateContext<RoomStateModel>, action: UpdateRound): void {

    const roomId = this.store.selectSnapshot(RoomState.roomId);
    const newRound = this.store.selectSnapshot(RoomState.round) + 1;
    const playerCount = this.store.selectSnapshot(PlayerState.playerCount);

    if (newRound === playerCount) {
      this.store.dispatch(new ChangeRoomPage(2));
    } else {
      this.angularFireStore
        .collection<RoomInterface>('rooms')
        .doc(roomId).update({
          round: newRound,
        });
    }

  }

  // sets the room in ngxs store
  @Action(SetRoom)
  setRoom(context: StateContext<RoomStateModel>, action: SetRoom): void {
    context.patchState({
      room: action.room,
    });


    if (action.room.page === 1 && action.room.round === 0) {
      this.store.dispatch(new SetupAlbum()).toPromise().then(() => {
        this.ngZone.run(() => this.router.navigate(['/game']));
      });
    }
    else if (action.room.page === 1) {
      if (action.room.round % 2) {
        this.ngZone.run(() => this.router.navigate(['/game/draw']));
      } else {
        this.ngZone.run(() => this.router.navigate(['/game/write']));
      }
    }
    if (action.room.page === 2) {
      this.ngZone.run(() => this.router.navigate(['/game/book']));
    }

    if (action.room.page === -1) {
      // gameOver
      this.ngZone.run(() => this.router.navigate(['/home']));
    }

  }
}
