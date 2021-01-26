import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasResizeComponent } from './canvas-resize.component';

describe('CanvasResizeComponent', () => {
  let component: CanvasResizeComponent;
  let fixture: ComponentFixture<CanvasResizeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasResizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasResizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
