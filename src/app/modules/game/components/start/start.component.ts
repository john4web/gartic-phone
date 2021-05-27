import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddContent } from 'src/app/store/album.action';
import { Finished, UpdateAlbumId } from 'src/app/store/player.actions';
import { PlayerInterface, PlayerState } from 'src/app/store/player.state';
import { UpdateRound } from 'src/app/store/room.actions';
import { RoomState } from 'src/app/store/room.state';
import { SetMyUser } from 'src/app/store/user.actions';
import { UserState } from 'src/app/store/user.state';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  players: PlayerInterface[];

  constructor(private store: Store, private ngZone: NgZone, private router: Router) {
    this.players = this.store.selectSnapshot(PlayerState.players);
  }

  storyText = '';

  @Select(UserState.userId) userId$: Observable<string>;
  @Select(RoomState.roomId) roomId$: Observable<string>;

  @Select(PlayerState.players)
  players$: Observable<PlayerInterface[]>;

  trackById(index: number, player: PlayerInterface): string {
    return player.id;
  }


  ngOnInit(): void {
    if (this.store.selectSnapshot(RoomState.currentPage) !== 1
      || this.store.selectSnapshot(RoomState.round) !== 0) {
      this.store.dispatch(new SetMyUser()).toPromise().then(() => {
        this.ngZone.run(() => this.router.navigate(['/home']));
      });
    }
    this.saveStoryText();
  }


  saveStoryText(): void {
    this.store.dispatch(new AddContent(this.storyText));
  }

  timerFinished(): void {
    this.store.dispatch(new UpdateAlbumId());
    this.store.dispatch(new UpdateRound());
  }

  finished(): void {
    this.store.dispatch(new Finished(this.store.selectSnapshot(UserState.userId), true));
  }

  storyTextIsFilled(): boolean {
    return this.storyText === '' ? false : true;
  }


}
