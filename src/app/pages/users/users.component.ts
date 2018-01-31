import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../_core/services/shared.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { IUser } from '../../_core/interfaces/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  uid = '';
  private listing$: Subscription = new Subscription();
  users: IUser[] = [];

  constructor(
    private sharedService: SharedService,
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
  ) { }

  ngOnInit() {
    this.getUserList();
  }

  ngOnDestroy() {
    this.listing$.unsubscribe();
  }

  async getUserList() {
    try {
      let user = this.sharedService.getUser();
      if (!user) {
        await this.afAuth.authState.first().toPromise();
        this.uid = await this.afAuth.auth.currentUser.uid;
        user = await this.afs.doc(`users/${this.uid}`).valueChanges().first().toPromise() as IUser;
        this.sharedService.storeUser(user);
      } else {
        this.uid = user.id;
      }

      if (user.admin) {
        this.listing$ = this.afs.collection(`users`, ref => {
          return ref.where('admin', '==', false);
        })
          .snapshotChanges()
          .subscribe(items => {
            this.users = [];
            items.map(item => {
              const data: IUser = {
                id: item.payload.doc.data().id,
                email: item.payload.doc.data().email,
                name: item.payload.doc.data().name,
                admin: item.payload.doc.data().admin,
                photo: item.payload.doc.data().photo
              };
              this.users.push(data);
            });
          });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async deleteUser(user: IUser) {
    await this.afs.doc(`users/${user.id}`).delete();

    const items = await this.afs.collection('reservations', ref => ref.where('userId', '==', user.id))
      .snapshotChanges().first().toPromise();
    for (const item of items) {
      try {
        await this.afs.doc(`reservations/${item.payload.doc.id}`).delete();
      } catch (e) {
        console.log(e);
      }
    }
  }
}
