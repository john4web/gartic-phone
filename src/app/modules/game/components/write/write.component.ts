import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddContent } from 'src/app/store/album.action';
import { AlbumState } from 'src/app/store/album.state';
import { Finished, UpdateAlbumId } from 'src/app/store/player.actions';
import { PlayerInterface, PlayerState } from 'src/app/store/player.state';
import { UpdateRound } from 'src/app/store/room.actions';
import { RoomState } from 'src/app/store/room.state';
import { SetMyUser } from 'src/app/store/user.actions';
import { UserState } from 'src/app/store/user.state';

@Component({
  selector: 'app-write',
  templateUrl: './write.component.html',
  styleUrls: ['./write.component.scss']
})
export class WriteComponent implements OnInit {

  describeDrawingText = '';
  lastDrawing = '';

  constructor(private store: Store, private ngZone: NgZone, private router: Router) {
    this.lastDrawing = AlbumState.getLastItem(store);
  }

  @Select(UserState.userId) userId$: Observable<string>;
  @Select(RoomState.roomId) roomId$: Observable<string>;

  @Select(PlayerState.players)
  players$: Observable<PlayerInterface[]>;

  trackById(index: number, player: PlayerInterface): string {
    return player.id;
  }

  ngOnInit(): void {

    this.saveStoryText();
    if (this.store.selectSnapshot(RoomState.currentPage) !== 1
      && this.store.selectSnapshot(RoomState.round) === 0
      && this.store.selectSnapshot(RoomState.round) % 2 !== 0) {
      this.store.dispatch(new SetMyUser()).toPromise().then(() => {
        this.ngZone.run(() => this.router.navigate(['/home']));
      });
    }
  }


  finished(): void {
    this.store.dispatch(new Finished(this.store.selectSnapshot(UserState.userId), true));
  }


  saveStoryText(): void {
    this.store.dispatch(new AddContent(this.describeDrawingText));
  }

  timerFinished(): void {
    this.store.dispatch(new UpdateAlbumId());
    this.store.dispatch(new UpdateRound());
  }

  describeDrawingTextIsFilled(): boolean {
    return this.describeDrawingText === '' ? false : true;
  }

}
