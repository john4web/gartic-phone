import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngxs/store';
import { AuthState } from 'src/app/store/auth.state';
import { AddPlayer } from 'src/app/store/player.actions';
import { CreateRoom } from 'src/app/store/room.actions';
import { RoomInterface } from 'src/app/store/room.state';
import { map } from 'rxjs/operators';
import { PlayerInterface } from 'src/app/store/player.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  name = '';
  nameClient = '';
  roomId = '';
  player1Name = '';
  player2Name = '';




  constructor(private angularFireStore: AngularFirestore, private store: Store) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.store.dispatch(new CreateRoom(this.name));
  }

  onSubmitJoin(): void {
    this.store.dispatch(new AddPlayer(this.roomId, this.nameClient));
  }

}
