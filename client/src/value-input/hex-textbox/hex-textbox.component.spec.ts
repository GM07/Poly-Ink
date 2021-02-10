import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HexTextboxComponent } from './hex-textbox.component';

describe('HexTextboxComponent', () => {
  let component: HexTextboxComponent;
  let fixture: ComponentFixture<HexTextboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HexTextboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HexTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
