import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractSelectionComponent } from './abstract-selection.component';

describe('AbstractSelectionComponent', () => {
  let component: AbstractSelectionComponent;
  let fixture: ComponentFixture<AbstractSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbstractSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
