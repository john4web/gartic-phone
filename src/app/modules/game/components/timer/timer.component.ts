import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
export class TimerComponent implements OnInit, OnDestroy {

  @Input() timerDuration;
  @ViewChild('countdownnumber') countDownNumber: ElementRef | null = null;

  constructor(private store: Store) { }

  timeLeft;
  interval;
  subscribeTimer: any;
  showCountDown = true;
  stopTimer = false;

  ngOnInit(): void {
    this.timeLeft = this.timerDuration;
    this.startTimer();
  }

  oberserableTimer(): void {
    const source = timer(1000, 2000);
    const abc = source.subscribe(val => {
      this.subscribeTimer = this.timeLeft - val;
    });
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        // save remainingtime in fireStore
        // this.store.dispatch(new UpdateTimer(this.timeLeft));
      } else {
        this.showCountDown = false;
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

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }


}
