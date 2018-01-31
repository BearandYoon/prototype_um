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

  isSocialLogin = true;
  newUser: ILoginInfo = {
    email: '',
    password: ''
  };

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
  }

  async login(provider: string) {
    try {
      if (provider === 'google') {
        await this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      } else if (provider === 'facebook') {
        await this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
      } else {
        await this.afAuth.auth.signInWithEmailAndPassword(this.newUser.email, this.newUser.password);
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
    this.isSocialLogin = !this.isSocialLogin;
  }
}
