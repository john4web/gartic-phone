import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Action, NgxsOnInit, Selector, State, StateContext, Store } from '@ngxs/store';
import { AuthState } from './auth.state';
import { PlayerInterface, PlayerState, PlayerStateModel } from './player.state';
import { ChangeRoomPage, CreateRoom, GetRoomFromFirestore, SetRoom } from './room.actions';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';
import { AddPlayer } from './player.actions';
import { ImageState } from './image.state';
import { UserState } from './user.state';
import { ActivatedRoute, Router } from '@angular/router';

export interface RoomInterface {
  id: string;
  page: number;
  createdAt: Date;
}

export interface RoomStateModel {
  room: RoomInterface;
}

/*
function getDefaultState(): RoomStateModel {
  return {
    room: {
      createdAt: new Date(),
      id: ''
    }
  };
}*/

@State<RoomStateModel>({
  name: 'roomstate',
  // defaults: getDefaultState(),
})
@Injectable()
export class RoomState implements NgxsOnInit {

  // allows to easily access the room id
  @Selector()
  static roomId(state: RoomStateModel): string | null {
    return state.room.id || null;
  }

  constructor(private angularAuth: AngularFireAuth, private router: Router, private angularFireStore: AngularFirestore, private store: Store, private route: ActivatedRoute) {

  }

  ngxsOnInit(context?: StateContext<any>): void {

  }


  @Action(CreateRoom)
  createRoom(context: StateContext<RoomStateModel>, action: CreateRoom): void {

    this.angularAuth.signOut();
    this.angularAuth.signInAnonymously().then((userCredential) => {

      const authID = userCredential.user.uid;

      this.angularFireStore
        .collection<RoomInterface>('rooms')
        .doc(authID).set({
          id: authID,
          page: 0,
          createdAt: new Date()
        })
        .then(() => {
          console.log('done');

        }).then(() => {

          // gets the room from firestore and syncs it to the ngxs store
          this.store.dispatch(new GetRoomFromFirestore(authID));

          // adding the host as a new player to the room

          const newPlayer: PlayerInterface = {
            id: '',
            name: action.hostName,
            isHost: true,
            image: action.imagePath

          };

          this.store.dispatch(new AddPlayer(authID, newPlayer));

        });






      // add the host as a player





    });
    /* const authID = this.store.selectSnapshot(AuthState.userId);

     this.angularFireStore.collection('rooms').doc(authID).set({}).then(() => {
       console.log('done');
     });*/
    /*



        const roomID = this.store.selectSnapshot(UserState.userId);
        // Adding new room
        this.angularFireStore
          .collection<RoomInterface>('rooms')
          .doc(roomID).set({
            createdAt: new Date(),
            id: roomID
          });

        const fileName: string = '../assets/images/' + this.store.selectSnapshot(ImageState.currentImage).imageName;
        context?.dispatch(new AddPlayer(roomID!, action.hostName, true, fileName));
        */

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








  // sets the room in ngxs store
  @Action(SetRoom)
  setRoom(context: StateContext<RoomStateModel>, action: SetRoom): void {
    context.patchState({
      room: action.room,
    });


    // change router according to the page field in the room state
    switch (action.room.page) {
      case 1:
        this.router.navigate(['/game']);
        break;
      case 2:
        this.router.navigate(['/draw']);
        break;
      case 3:
        this.router.navigate(['/write']);
        break;

    }


  }
}
