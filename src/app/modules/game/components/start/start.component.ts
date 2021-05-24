import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddContent, SetAlbum } from 'src/app/store/album.action';
import { UpdateAlbumId } from 'src/app/store/player.actions';
import { PlayerInterface, PlayerState } from 'src/app/store/player.state';
import { UpdateRound } from 'src/app/store/room.actions';
import { RoomState } from 'src/app/store/room.state';
import { UserState } from 'src/app/store/user.state';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  players: PlayerInterface[];

  constructor(private store: Store) {
    this.players = this.store.selectSnapshot(PlayerState.players);
    console.log(this.players);
  }

  storyText = '';

  @Select(UserState.userId) userId$: Observable<string>;
  @Select(RoomState.roomId) roomId$: Observable<string>;

  @Select(PlayerState.players)
  players$: Observable<PlayerInterface[]>;

  trackById(index: number, player: PlayerInterface): string {
    console.log('playerID: ' + player.id);
    return player.id;
  }


  ngOnInit(): void {
    console.log(this.store.selectSnapshot(PlayerState.players));
  }


  saveStoryText() {
    this.store.dispatch(new AddContent(this.storyText));
  }

  timerFinished() {
    this.store.dispatch(new UpdateAlbumId());
    this.store.dispatch(new UpdateRound());
  }


}
