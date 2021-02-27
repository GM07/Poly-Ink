import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangleSelectionComponent } from './rectangle-selection.component';

describe('RectangleSelectionComponent', () => {
  let component: RectangleSelectionComponent;
  let fixture: ComponentFixture<RectangleSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
