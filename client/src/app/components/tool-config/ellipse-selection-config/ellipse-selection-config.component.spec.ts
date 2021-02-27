import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EllipseSelectionConfigComponent } from './ellipse-selection-config.component';

describe('EllipseSelectionConfigComponent', () => {
  let component: EllipseSelectionConfigComponent;
  let fixture: ComponentFixture<EllipseSelectionConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EllipseSelectionConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EllipseSelectionConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
