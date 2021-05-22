import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AddStoryText } from 'src/app/store/album.action';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {

  storyText = '';

  constructor(private store: Store) { }

  ngOnInit(): void {
  }


  saveStoryText() {

    this.store.dispatch(new AddStoryText(this.storyText));

  }


}
