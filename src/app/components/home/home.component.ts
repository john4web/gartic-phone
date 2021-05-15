import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AddPlayer} from 'src/app/store/player.actions';
import { CreateRoom } from 'src/app/store/room.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  name= '';
  nameClient = '';
  roomId = '';

  constructor(private store: Store) {
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
