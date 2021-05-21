import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UserState } from './store/user.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gartic-phone';
  @Select(UserState.userId) userId$!: Observable<string>;
}
