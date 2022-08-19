import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarDumbComponent } from './calendar-dumb.component';

describe('CalendarDumbComponent', () => {
  let component: CalendarDumbComponent;
  let fixture: ComponentFixture<CalendarDumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarDumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarDumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
