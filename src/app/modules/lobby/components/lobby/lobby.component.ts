import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddText } from 'src/app/store/player.actions';
import { PlayerInterface, PlayerState } from 'src/app/store/player.state';
import { RoomState } from 'src/app/store/room.state';
import { UserState } from 'src/app/store/user.state';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  constructor(private store: Store) { }


  @Select(UserState.userId) uid$: Observable<string>;
  @Select(RoomState.roomId) roomId$: Observable<string>;

  showButton: boolean;

  @Select(PlayerState.players)
  players$: Observable<PlayerInterface[]>;

  trackById(index: number, player: PlayerInterface): string {
    return player.id;
  }

  ngOnInit(): void {
  }

  addProperty(): void {
    this.store.dispatch(new AddText('hallo'));
  }

}
