import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ChangeImage } from 'src/app/store/image.actions';
import { ImageState } from 'src/app/store/image.state';
import { AddPlayer } from 'src/app/store/player.actions';
import { CreateRoom } from 'src/app/store/room.actions';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userName = '';
  pastedRoomID = '';
  imageFile = '../assets/images/Divotkey.jpg';

  constructor(private store: Store, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
  }

  createRoom(): void {
    this.store.dispatch(new CreateRoom(this.userName));
    this.router.navigate(['home/lobby']);
  }

  joinRoom(): void {
    this.store.dispatch(new AddPlayer(this.pastedRoomID, this.userName, false, this.imageFile));
    this.router.navigate(['home/lobby']);
  }

  change(): void {
    this.store.dispatch(new ChangeImage());
    this.imageFile = '../assets/images/' + this.store.selectSnapshot(ImageState.currentImage).imageName;
  }

}
