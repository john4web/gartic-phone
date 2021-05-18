import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddPlayer } from 'src/app/store/player.actions';
import { PlayerInterface, PlayerState } from 'src/app/store/player.state';
import { CreateRoom } from 'src/app/store/room.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  hostName = '';
  clientName = '';
  pastedRoomID = '';

  constructor(private store: Store) {
  }




  @Select(PlayerState.players)

  players$: Observable<PlayerInterface[]>;


  trackById(index: number, player: PlayerInterface): string {
    return player.id;
  }








  ngOnInit(): void {
  }

  createRoom(): void {
    this.store.dispatch(new CreateRoom(this.hostName));
  }

  joinRoom(): void {
    this.store.dispatch(new AddPlayer(this.pastedRoomID, this.clientName, false));
  }

}
