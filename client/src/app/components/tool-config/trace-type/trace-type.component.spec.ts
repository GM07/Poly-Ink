import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceTypeComponent } from './trace-type.component';

describe('TraceTypeComponent', () => {
  let component: TraceTypeComponent;
  let fixture: ComponentFixture<TraceTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraceTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraceTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
