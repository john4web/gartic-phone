import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ObjectUnsubscribedError, Observable } from 'rxjs';
import { AddText } from 'src/app/store/player.actions';
import { PlayerInterface, PlayerState } from 'src/app/store/player.state';
import { RoomState } from 'src/app/store/room.state';
import { UserState } from 'src/app/store/user.state';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { AuthState } from 'src/app/store/auth.state';
import { ChangeRoomPage } from 'src/app/store/room.actions';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) { }


  @Select(UserState.userId) authUserId$: Observable<string>;
  @Select(RoomState.roomId) roomId$: Observable<string>;

  showButton: boolean;

  @Select(PlayerState.players)
  players$: Observable<PlayerInterface[]>;

  trackById(index: number, player: PlayerInterface): string {
    console.log('playerID: ' + player.id);
    return player.id;
  }

  ngOnInit(): void {

  }

  addProperty(): void {
    this.store.dispatch(new AddText('hallo'));
  }

  startGame(): void {

    this.store.dispatch(new ChangeRoomPage(1));
  }

}
