import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Album, AlbumState } from 'src/app/store/album.state';
import { PlayerState } from 'src/app/store/player.state';
import { ChangeAlbumIndex, ChangeRoomPage, DeleteRoom } from 'src/app/store/room.actions';
import { RoomState } from 'src/app/store/room.state';
import { SetMyUser } from 'src/app/store/user.actions';
import { UserState } from 'src/app/store/user.state';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  @Select(UserState.userId) userId$: Observable<string>;
  @Select(RoomState.roomId) roomId$: Observable<string>;
  @Select(RoomState.albumIndex) currentAlbumIndex$: Observable<number>;
  @Select(PlayerState.playerCount) playerCount$: Observable<number>;

  @Select(AlbumState.albums)
  albums$: Observable<Album[]>;

  trackById(index: number, album: Album): number {
    return album.playerId;
  }


  constructor(private store: Store, private router: Router, private ngZone: NgZone) { }

  ngOnInit(): void {
    if (this.store.selectSnapshot(RoomState.currentPage) !== 2) {
      this.store.dispatch(new SetMyUser()).toPromise().then(() => {
        this.ngZone.run(() => this.router.navigate(['/home']));
      });
    } /*else {
      const audio = new Audio();
      audio.autoplay = true;
      audio.src = '../../../../assets/audio/album.mp3';
      audio.load();
    }*/
  }

  nextAlbum(): void {
    const currentIndex = this.store.selectSnapshot(RoomState.albumIndex);
    this.store.dispatch(new ChangeAlbumIndex(currentIndex + 1));
  }

  exitGame(): void {
    if (this.store.selectSnapshot(RoomState.roomId) === this.store.selectSnapshot(UserState.userId)) {
      this.store.dispatch(new ChangeRoomPage(-1)).toPromise().then(() => {
        this.store.dispatch(new DeleteRoom()).toPromise().then(() => {
          this.store.dispatch(new SetMyUser());
        });
      });
    } else {
      this.store.dispatch(new SetMyUser()).toPromise().then(() => {
        this.ngZone.run(() => this.router.navigate(['/home']));
      });
    }

  }

}
