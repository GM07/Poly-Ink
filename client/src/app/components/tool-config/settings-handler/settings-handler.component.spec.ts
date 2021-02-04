import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsHandlerComponent } from './settings-handler.component';

describe('SettingsHandlerComponent', () => {
  let component: SettingsHandlerComponent;
  let fixture: ComponentFixture<SettingsHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
