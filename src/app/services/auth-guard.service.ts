import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RoomState } from '../store/room.state';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private store: Store) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // return true if you want to navigate, otherwise return false
    if (typeof this.store.selectSnapshot(RoomState.roomId) !== 'undefined') {
      return true;
    } else {
      return false;
    }
  }
}
