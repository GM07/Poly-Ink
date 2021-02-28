import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionHandlerComponent } from './selection-handler.component';

describe('SelectionHandlerComponent', () => {
  let component: SelectionHandlerComponent;
  let fixture: ComponentFixture<SelectionHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
