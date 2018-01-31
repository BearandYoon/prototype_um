import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/user';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SharedService {

  private user = new Subject<IUser>();
  user$ = this.user.asObservable();
  userInfo: IUser = null;

  constructor() { }

  storeUser(user: IUser) {
    this.userInfo = user;
    this.user.next(user);
  }

  getUser(): IUser {
    return this.userInfo;
  }

}
