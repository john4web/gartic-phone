import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { CreateRoom } from 'src/app/store/room.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  name= '';

  constructor(private store: Store) {
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    console.log("submit");
    this.store.dispatch(new CreateRoom(this.name));
  }

}
