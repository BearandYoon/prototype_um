import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationBookingComponent } from './reservation-booking.component';

describe('ReservationBookingComponent', () => {
  let component: ReservationBookingComponent;
  let fixture: ComponentFixture<ReservationBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
