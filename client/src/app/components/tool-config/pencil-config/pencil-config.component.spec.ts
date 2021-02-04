import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PencilConfigComponent } from './pencil-config.component';

describe('PencilConfigComponent', () => {
  let component: PencilConfigComponent;
  let fixture: ComponentFixture<PencilConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PencilConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
