import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { IUser } from '../../../_core/interfaces/user';
import { ILoginInfo } from '../../../_core/interfaces/login-info';
import { SharedService } from '../../../_core/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isLogin = true;
  loginUser: ILoginInfo = {
    email: '',
    password: ''
  };
  newUser = {
    email: '',
    password: '',
    confirm: ''
  };

  formChecker = {
    success: true,
    msg: ''
  };

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
  }

  authenticate() {
    if (this.isLogin) {
      this.formChecker = this.loginFormValidation();
    } else {
      this.formChecker = this.signUpFormValidation();
    }

    if (this.formChecker.success) {
      this.authenticateUser();
    }
  }

  async authenticateUser() {
    try {
      if (this.isLogin) {
        await this.afAuth.auth.signInWithEmailAndPassword(this.loginUser.email, this.loginUser.password);
      } else {
        await this.afAuth.auth.createUserWithEmailAndPassword(this.newUser.email, this.newUser.password);
      }

      const currentUser = await this.afAuth.auth.currentUser;
      const user: IUser = {
        id: currentUser.uid,
        name: currentUser.displayName,
        email: currentUser.email,
        photo: currentUser.photoURL,
        admin: false
      };

      const db = await this.afs.doc(`users/${currentUser.uid}`).valueChanges().first().toPromise() as IUser;

      if (!db) {
        await this.afs.doc(`users/${currentUser.uid}`).set(user);
      } else {
        user.admin = db.admin;
      }

      this.sharedService.storeUser(user);
      this.router.navigate(['/reservations']);
    } catch (e) {
      console.log(e);
    }
  }

  toggleLoginMethod() {
    this.formChecker = {
      success: true,
      msg: ''
    };
    this.isLogin = !this.isLogin;
  }

  loginFormValidation()  {
    if (!this.loginUser.email || !this.loginUser.password) {
      return {success: false, msg: 'All fields are required'};
    } else {
      if (!this.loginUser.email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
        return {success: false, msg: 'Enter a valid email address'};
      }

      if (!this.loginUser.password.match(/^[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
        return {success: false, msg: 'Password must be at least 6 characters'};
      }
      return {success: true, msg: ''};
    }
  }

  signUpFormValidation()  {
    if (!this.newUser.email || !this.newUser.password || !this.newUser.confirm) {
      return {success: false, msg: 'All fields are required'};
    } else {
      if (!this.newUser.email.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
        return {success: false, msg: 'Enter a valid email address'};
      }

      if (!this.newUser.password.match(/^[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
        return {success: false, msg: 'Password must be at least 6 characters'};
      }

      if (!this.newUser.confirm.match(/^[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
        return {success: false, msg: 'Password must be at least 6 characters'};
      }

      if (this.newUser.password !== this.newUser.confirm) {
        return {success: false, msg: 'No match password.'};
      }
      return {success: true, msg: ''};
    }
  }
}
