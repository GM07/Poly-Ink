import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractSelectionConfigComponent } from './abstract-selection-config.component';

describe('AbstractSelectionConfigComponent', () => {
  let component: AbstractSelectionConfigComponent;
  let fixture: ComponentFixture<AbstractSelectionConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbstractSelectionConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbstractSelectionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
