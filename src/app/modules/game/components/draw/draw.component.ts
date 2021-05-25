import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddContent, GetLastItem } from 'src/app/store/album.action';
import { AlbumState } from 'src/app/store/album.state';
import { UpdateAlbumId } from 'src/app/store/player.actions';
import { PlayerInterface, PlayerState } from 'src/app/store/player.state';
import { UpdateRound } from 'src/app/store/room.actions';
import { RoomState } from 'src/app/store/room.state';
import { UserState } from 'src/app/store/user.state';

@Component({
  selector: 'app-draw',
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements OnInit {

  lastText: string;
  drawing = '';

  @Select(UserState.userId) userId$: Observable<string>;
  @Select(RoomState.roomId) roomId$: Observable<string>;

  @Select(PlayerState.players)
  players$: Observable<PlayerInterface[]>;

  trackById(index: number, player: PlayerInterface): string {
    return player.id;
  }

  constructor(private store: Store) {
    this.lastText = AlbumState.getLastItem(store);
  }

  ngOnInit(): void {


  }

  drawingChanged(newDrawing): void {
    this.drawing = newDrawing;
    this.store.dispatch(new AddContent(this.drawing));
  }

  timerFinished(): void {
    this.store.dispatch(new UpdateAlbumId());
    this.store.dispatch(new UpdateRound());
  }

}
