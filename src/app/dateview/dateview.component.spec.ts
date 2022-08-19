import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateviewComponent } from './dateview.component';

describe('DateviewComponent', () => {
  let component: DateviewComponent;
  let fixture: ComponentFixture<DateviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
