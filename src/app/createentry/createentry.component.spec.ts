import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateentryComponent } from './createentry.component';

describe('CreateentryComponent', () => {
  let component: CreateentryComponent;
  let fixture: ComponentFixture<CreateentryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateentryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateentryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
