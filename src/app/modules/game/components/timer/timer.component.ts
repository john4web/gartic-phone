import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { timer } from 'rxjs';
import { UpdateAlbumId } from 'src/app/store/player.actions';
import { UpdateRound } from 'src/app/store/room.actions';
import { RoomState } from 'src/app/store/room.state';
import { UserState } from 'src/app/store/user.state';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  @Input() timerDuration;

  constructor(private store: Store) { }

  timeLeft = 20;
  interval;
  subscribeTimer: any;
  ngOnInit(): void {
    this.timeLeft = this.timerDuration;
    this.startTimer();
  }

  oberserableTimer(): void {
    const source = timer(1000, 2000);
    const abc = source.subscribe(val => {
      console.log(val, '-');
      this.subscribeTimer = this.timeLeft - val;
    });
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        // save remainingtime in fireStore
        // this.store.dispatch(new UpdateTimer(this.timeLeft));
        console.log(this.timeLeft);
      } else {

        if (this.store.selectSnapshot(RoomState.roomId) === this.store.selectSnapshot(UserState.userId)) {
          this.store.dispatch(new UpdateAlbumId());
          this.store.dispatch(new UpdateRound());
        }

        clearInterval(this.interval);
        this.timeLeft = 20;
        // this.store.dispatch(new UpdateTimer(this.timeLeft));
      }
    }, 1000);
  }

  pauseTimer(): void {
    clearInterval(this.interval);
  }









}
