import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from './store/auth.state';
import { UserState } from './store/user.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gartic-phone';
  @Select(UserState.userId) authUserId$!: Observable<string>;
}
