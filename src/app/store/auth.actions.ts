import firebase from 'firebase';
import User = firebase.User;


export class UserChanged {
  static readonly type = '[Auth] UserChanged';

  constructor(public user: User | null) {

  }


}
