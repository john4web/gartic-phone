import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Album, AlbumState } from 'src/app/store/album.state';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  @Select(AlbumState.albums)
  albums$: Observable<Album[]>;

  trackById(index: number, album: Album): number {
    console.log('playerID: ' + album.playerId);
    return album.playerId;
  }


  constructor() { }

  ngOnInit(): void {
  }

}
