import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WordmarkComponent } from './wordmark.component';

describe('WordmarkComponent', () => {
  let component: WordmarkComponent;
  let fixture: ComponentFixture<WordmarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WordmarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WordmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
