import {Component, Input, Output, EventEmitter, ChangeDetectorRef,
  LOCALE_ID, Inject, OnChanges, OnInit, forwardRef, OnDestroy} from '@angular/core';
import {FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import * as moment from 'moment';

const DATE_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DatePickerComponent),
  multi: true
};

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [DATE_VALUE_ACCESSOR]
})
export class DatePickerComponent implements OnChanges, OnInit, OnDestroy {

  @Input() parent: FormGroup;
  /**
   * The current view date
   */
  @Input() viewDate: Date;
  /**
   * A function that will be called before each cell is rendered. The first argument will contain the calendar cell.
   * If you add the `cssClass` property to the cell it will add that class to the cell in the template
   */
  @Input() dayModifier: Function;
  /**
   * Called when the day cell is clicked
   */
  @Output() dayClicked: EventEmitter<{day: Date}> = new EventEmitter<{day: Date}>();


  openRowIndex: number;

  todayDate: Date;
  days: Date[];
  dayShowIndex = 0; // 0 ~ 15
  currentSelected: Date;

  value;
  onModelChange: Function = (_: any) => {
  }

  onModelTouched: Function = () => {
  }

  registerOnTouched(fn) {
    this.onModelTouched = fn;
  }

  registerOnChange(fn) {
    this.onModelChange = fn;
  }
  writeValue(value) {
    this.value = value || 0;
  }

  constructor(private cdr: ChangeDetectorRef, @Inject(LOCALE_ID) locale: string) {
    this.todayDate = new Date();
    this.todayDate.setHours(0, 0, 0, 0);
    this.refreshDays();
  }


  ngOnInit(): void {
    this.refreshDays();
  }


  ngOnChanges(changes: any): void {

  }


  ngOnDestroy(): void {

  }

  private refreshDays(): void {
    const daysToShow = [];
    for (let i = this.dayShowIndex - 2; i <= this.dayShowIndex + 2; i++) {
      const dt = new Date(this.todayDate);
      dt.setDate(this.todayDate.getDate() + i);
      daysToShow.push(dt);
    }
    this.days = daysToShow;
  }

  formattedDate(dt, format) {
    return moment(dt).format(format);
  }

  dayClick(dt) {
    if (this.dayModifier(dt) === '') {
      this.currentSelected = dt;


      let selectedDay = new Date(dt).toDateString();
      selectedDay = selectedDay.split(' ').slice(0, 4).join(' ')
      this.writeValue(selectedDay);
      this.onModelChange(this.value);
      this.onModelTouched();
    }
  }

  private refreshAll(): void {
    this.refreshDays();
  }

  gotoPrev() {
    if (this.dayShowIndex > 0) {
      this.dayShowIndex = this.dayShowIndex - 5;
    }
    this.refreshDays();
  }
  gotoNext() {
    if (this.dayShowIndex < 15) {
      this.dayShowIndex = this.dayShowIndex + 5;
    }
    this.refreshDays();
  }

}
