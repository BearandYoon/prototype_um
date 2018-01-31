import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { IUser } from '../../_core/interfaces/user';
import { SharedService } from '../../_core/services/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: IUser;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.sharedService.user$.subscribe((user: IUser) => {
      this.user = user;
    });
  }

  async logoutUser() {
    try {
      await this.afAuth.auth.signOut();
    } catch (e) {

    } finally {
      this.sharedService.storeUser(null);
      this.router.navigate(['login']);
    }
  }

}
