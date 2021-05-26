import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { UserChanged } from 'src/app/store/auth.actions';
import { ChangeImage } from 'src/app/store/image.actions';
import { ImageState } from 'src/app/store/image.state';
import { AddPlayer, GetPlayersFromFirestore } from 'src/app/store/player.actions';
import { CreateRoom, GetRoomFromFirestore } from 'src/app/store/room.actions';
import firebase from 'firebase';
import User = firebase.User;
import { AuthState } from 'src/app/store/auth.state';
import { PlayerInterface, PlayerState } from 'src/app/store/player.state';
import { UserState } from 'src/app/store/user.state';
import { switchMap, take, takeUntil, takeWhile, tap } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userName = '';
  pastedRoomID = '';
  imageFile = '../assets/images/Divotkey.jpg';

  constructor(private store: Store, private route: ActivatedRoute, private router: Router, private angularAuth: AngularFireAuth) {
  }

  ngOnInit(): void {
    const audio = new Audio();
    audio.src = '../../../../assets/audio/welcome.mp3';
    audio.load();
    audio.play();
  }

  createRoom(): void {
    this.store.dispatch(new CreateRoom(this.userName, this.imageFile));
    this.store.dispatch(new GetPlayersFromFirestore(this.store.selectSnapshot(UserState.userId)));
    this.router.navigate(['home/lobby']);
  }

  joinRoom(): void {

    this.store.dispatch(new GetRoomFromFirestore(this.pastedRoomID));
    this.store.dispatch(new GetPlayersFromFirestore(this.pastedRoomID));

    // Richtiger kack
    this.store.select(PlayerState.playerCount).pipe(
      takeWhile(count => typeof count === 'undefined', true)
    ).subscribe((count) => {
      if (typeof count !== 'undefined') {
        const newPlayer: PlayerInterface = {
          id: this.store.selectSnapshot(UserState.userId),
          playerId: 0,
          name: this.userName,
          isHost: false,
          image: this.imageFile,
          currentAlbumId: 0,
        };
        this.store.dispatch(new AddPlayer(this.pastedRoomID, newPlayer));
        this.router.navigate(['home/lobby']);
      }
    });


    /*
    this.store.dispatch(new UserUpdate(this.pastedRoomID));

    //localStorage.setItem('joinedRoomID', this.pastedRoomID);
    this.store.dispatch(new GetRoomFromFirestore(this.pastedRoomID));



        const a = this.angularAuth.signInWithCredential
        this.store.dispatch(new UserChanged(

        ));

        this.angularAuth.signInWithCredential(this.pastedRoomID);

        this.store.dispatch(new GetRoomFromFirestore(this.pastedRoomID));
        this.store.dispatch(new AddPlayer(this.pastedRoomID, this.userName, false, this.imageFile));
        this.router.navigate(['home/lobby']);
        */
  }

  change(): void {
    this.store.dispatch(new ChangeImage());
    this.imageFile = '../assets/images/' + this.store.selectSnapshot(ImageState.currentImage).imageName;
  }

}
