import {Component, OnChanges, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

import { SharedService } from '../../../_core/services/shared.service';
import { IReservation } from '../../../_core/interfaces/reservation';
import { IUser } from '../../../_core/interfaces/user';
import { FileUpload } from '../../../_core/interfaces/file-upload';

import {
  addDays,
  addHours,
  addMonths,
  addWeeks,
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isSunday,
  isWeekend,
  isTuesday,
  isWednesday,
  isThursday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks
} from 'date-fns';

export enum EPageType {
  CreatePage,
  EditPage,
  ViewPage
}

@Component({
  selector: 'app-reservation-booking',
  templateUrl: './reservation-booking.component.html',
  styleUrls: ['./reservation-booking.component.scss']
})
export class ReservationBookingComponent implements OnInit, OnChanges {

  dayModifier: Function;
  minDate: Date = subDays(new Date(), 1);
  maxDate: Date = addWeeks(new Date(), 2);
  viewDate: Date = new Date();
  reservation: IReservation = {
    name: '',
    email: '',
    userId: '',
    owner: '',
    reservationDate: this.viewDate.toDateString(),
    phone: ''
  };
  uid = '';

  enum_PageType = EPageType;
  pageType: EPageType = EPageType.CreatePage;

  form: FormGroup;

  currentFileUpload: FileUpload;

  constructor(
    private sharedService: SharedService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {
    this.dayModifier = function (day: Date): string {
      if (!this.dateIsValid(day)) {
        // day.cssClass = 'cal-disabled';
        return 'disabled';
      }
      return '';
    }.bind(this);
    this.dateOrViewChanged();

    this.form = this.formBuilder.group({
      'reservationDate' : [this.reservation.reservationDate],
      'name': [this.reservation.name, Validators.required],
      'email': [this.reservation.email, Validators.required]
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      if (params.method === 'edit') {
        this.pageType = EPageType.EditPage;
        this.getReservation(params.id);
      } else if (params.method === 'view') {
        this.pageType = EPageType.ViewPage;
        this.getReservation(params.id);
      } else {
        this.pageType = EPageType.CreatePage;
      }
    });
  }

  ngOnChanges() {
    if (this.reservation) {
      this.form.patchValue(this.reservation);
    }
  }

  async getReservation(id: string) {
    try {
      const user = this.sharedService.getUser();
      if (!user) {
        await this.afAuth.authState.first().toPromise();
        this.uid = await this.afAuth.auth.currentUser.uid;
      } else {
        this.uid = user.id;
      }
      this.reservation = await this.afs.doc(`reservations/${id}`).valueChanges().first().toPromise() as IReservation;
      if (this.reservation) {
        this.reservation.$key = id;
        this.form.setValue({
          'name': this.reservation.name,
          'reservationDate': this.reservation.reservationDate,
          'email': this.reservation.email
          }
        );
      }
    } catch (e) {
    }
  }

  async onSubmit() {
    try {
      const user: IUser = this.sharedService.getUser();
      let uid = '';
      if (!user.id) {
        await this.afAuth.authState.first().toPromise();
        uid = this.afAuth.auth.currentUser.uid;
      } else {
        uid = user.id;
      }

      let imageUrl = '';
      if (this.currentFileUpload) {
        imageUrl = this.currentFileUpload.url;
      }

      const reservation: IReservation = {
        userId: uid,
        owner: user.name,
        imageUrl: imageUrl,
        ...this.form.value
      };

      if (this.pageType === EPageType.CreatePage) {
        await this.afs.collection(`reservations`).add(reservation);
      } else if (this.pageType === EPageType.EditPage) {
        await this.afs.doc(`reservations/${this.reservation.$key}`).update(reservation);
      }
      this.router.navigate(['/reservations']);
    } catch (e) {
      console.log(e);
    } finally {

    }
  }

  onFileUploadSuccess(uploadedFile: FileUpload) {
    this.currentFileUpload = uploadedFile;
  }

  dayClicked(e) {
  }

  changeDate(date: Date): void {
    this.viewDate = date;
    this.dateOrViewChanged();
  }

  dateIsValid(date: Date): boolean {
    return date >= this.minDate && date <= this.maxDate;
  }

  dateOrViewChanged(): void {
  }
}
