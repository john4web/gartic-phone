import { Component, NgZone, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AddText, UpdatePlayerIDs } from 'src/app/store/player.actions';
import { PlayerInterface, PlayerState } from 'src/app/store/player.state';
import { RoomState } from 'src/app/store/room.state';
import { UserState } from 'src/app/store/user.state';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangeRoomPage } from 'src/app/store/room.actions';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  constructor(private store: Store, private router: Router, private route: ActivatedRoute, private ngZone: NgZone) { }


  @Select(UserState.userId) authUserId$: Observable<string>;
  @Select(RoomState.roomId) roomId$: Observable<string>;

  showButton: boolean;
  copyClipboardMessage = '';
  showCopyClipboardMessage = false;

  @Select(PlayerState.players)
  players$: Observable<PlayerInterface[]>;

  trackById(index: number, player: PlayerInterface): string {
    return player.id;
  }

  ngOnInit(): void {
    if (typeof this.store.selectSnapshot(RoomState.currentPage) === 'undefined' ||
      this.store.selectSnapshot(RoomState.currentPage) !== 0) {
      this.ngZone.run(() => this.router.navigate(['/home']));
    }
  }

  addProperty(): void {
    this.store.dispatch(new AddText('hallo'));
  }

  startGame(): void {
    this.store.dispatch(new UpdatePlayerIDs()).toPromise().then(() => {
      this.store.dispatch(new ChangeRoomPage(1));
    });
  }

  copyRoomIDToClipboard(): void {
    const authID = this.store.selectSnapshot(RoomState.roomId);
    navigator.clipboard.writeText(authID).then(
      () => {
        this.copyClipboardMessage = 'Room ID copied!';
      },
      () => {
        this.copyClipboardMessage = 'Copying failed!';
      }
    );

    this.showCopyClipboardMessage = true;
    setTimeout(() => {
      this.showCopyClipboardMessage = false;
    }, 3000);


  }

}
