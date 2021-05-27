import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { ChangeImage } from 'src/app/store/image.actions';
import { ImageInterface, ImageState } from 'src/app/store/image.state';
import { AddPlayer, GetPlayersFromFirestore } from 'src/app/store/player.actions';
import { CreateRoom, GetRoomFromFirestore } from 'src/app/store/room.actions';
import { PlayerInterface, PlayerState } from 'src/app/store/player.state';
import { UserState } from 'src/app/store/user.state';
import { takeWhile } from 'rxjs/operators';
import { RoomState } from 'src/app/store/room.state';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewChecked {
  userName = '';
  pastedRoomID = '';

  @Select(ImageState.currentImage) imageFile$: Observable<ImageInterface>;

  imageFile = '';


  constructor(private store: Store, private route: ActivatedRoute, private router: Router, private angularAuth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.imageFile$.subscribe((a) => {
      this.imageFile = a.imageName;
    });
    // spielt es komischerweise 2 mal?
    const audio = new Audio();
    audio.autoplay = true;
    audio.src = '../../../../assets/audio/welcome.mp3';
    audio.load();
  }

  ngAfterViewChecked(): void {
  }

  createRoom(): void {
    const audio = new Audio();
    audio.autoplay = true;
    audio.src = '../../../../assets/audio/host.mp3';
    audio.load();
    this.store.dispatch(new CreateRoom(this.userName, this.imageFile)).toPromise().then(() => {
      this.store.dispatch(new GetPlayersFromFirestore(this.store.selectSnapshot(UserState.userId)));
    }).then(() => {
      this.store.select(RoomState.roomId).subscribe((roomId) => {
        if (typeof roomId !== 'undefined') { this.router.navigate(['home/lobby']); }
      });
    });

  }

  joinRoom(): void {
    const audio = new Audio();
    audio.autoplay = true;
    audio.src = '../../../../assets/audio/client.mp3';
    audio.load();

    this.store.dispatch(new GetRoomFromFirestore(this.pastedRoomID));
    this.store.dispatch(new GetPlayersFromFirestore(this.pastedRoomID));

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
          finished: false
        };
        this.store.dispatch(new AddPlayer(this.pastedRoomID, newPlayer));
        this.router.navigate(['home/lobby']);
      }
    });

    this.store.select(RoomState.roomId).subscribe((roomId) => {
      if (typeof roomId !== undefined) { this.router.navigate(['home/lobby']); }
    });

  }

  change(): void {
    this.store.dispatch(new ChangeImage());
  }

  userNameFilled(): boolean {
    return this.userName === '' ? false : true;
  }

  pastedRoomIdFilled(): boolean {
    return this.pastedRoomID === '' ? false : true;
  }

}
