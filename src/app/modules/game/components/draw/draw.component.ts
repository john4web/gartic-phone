import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UpdateAlbumId } from 'src/app/store/player.actions';
import { PlayerInterface, PlayerState } from 'src/app/store/player.state';
import { UpdateRound } from 'src/app/store/room.actions';
import { UserState } from 'src/app/store/user.state';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements OnInit {

  storyText = '';

  @Select(UserState.userId) userId$: Observable<string>;

  @Select(PlayerState.players)
  players$: Observable<PlayerInterface[]>;

  trackById(index: number, player: PlayerInterface): string {
    return player.id;
  }

  constructor(private store: Store) { }

  ngOnInit(): void {
  }


  saveStoryText() {
    this.store.dispatch(new UpdateAlbumId());
    this.store.dispatch(new UpdateRound());
  }

}
