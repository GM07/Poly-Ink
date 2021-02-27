import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EllipseSelectionComponent } from './ellipse-selection.component';

describe('EllipseSelectionComponent', () => {
  let component: EllipseSelectionComponent;
  let fixture: ComponentFixture<EllipseSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EllipseSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EllipseSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
