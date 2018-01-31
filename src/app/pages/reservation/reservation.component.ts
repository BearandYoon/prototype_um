import { Component, OnInit, OnDestroy } from '@angular/core';
import { SharedService } from '../../_core/services/shared.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Subscription } from 'rxjs/Subscription';
import { IReservation } from '../../_core/interfaces/reservation';
import { IUser } from '../../_core/interfaces/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit, OnDestroy {

  uid = '';
  private listing$: Subscription = new Subscription();
  reservations: IReservation[] = [];

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private sharedService: SharedService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getBookingList();
  }

  async getBookingList() {
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
        this.listing$ = this.afs.collection(`reservations`)
          .snapshotChanges()
          .subscribe(items => {
            this.reservations = [];
            items.map(item => {
              const reservation: IReservation = {
                $key: item.payload.doc.id,
                email: item.payload.doc.data().email,
                name: item.payload.doc.data().name,
                userId: item.payload.doc.data().userId,
                owner: item.payload.doc.data().owner,
                reservationDate: item.payload.doc.data().reservationDate
              };
              this.reservations.push(reservation);
            });
          });
      } else {
        this.listing$ = this.afs.collection(`reservations`, ref => {
          return ref.where('userId', '==', this.uid);
        })
          .snapshotChanges()
          .subscribe(items => {
            this.reservations = [];
            items.map(item => {
              const reservation: IReservation = {
                $key: item.payload.doc.id,
                email: item.payload.doc.data().email,
                name: item.payload.doc.data().name,
                userId: item.payload.doc.data().userId,
                owner: item.payload.doc.data().owner,
                reservationDate: item.payload.doc.data().reservationDate
              };
              this.reservations.push(reservation);
            });
          });
      }
    } catch (e) {
      console.log(e);
    }
  }

  ngOnDestroy() {
    this.listing$.unsubscribe();
  }

  showDetails(res: IReservation) {
    this.router.navigate(['/reservations/view/' + res.$key]);
  }

  editReservation(res: IReservation) {
    this.router.navigate(['/reservations/edit/' + res.$key]);
  }

  async deleteReservation(res: IReservation) {
    try {
      await this.afs.doc(`reservations/${res.$key}`).delete();
    } catch (e) {
      console.log(e);
    }
  }
}
