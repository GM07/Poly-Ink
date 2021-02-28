import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { RectangleSelectionComponent } from './rectangle-selection.component';
import { DrawingService } from '@app/services/drawing/drawing.service';

describe('RectangleSelectionComponent', () => {
  let component: RectangleSelectionComponent;
  let fixture: ComponentFixture<RectangleSelectionComponent>;
  let canvasTestHelper: CanvasTestHelper;
  let service: DrawingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectangleSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    canvasTestHelper = TestBed.inject(CanvasTestHelper);
    fixture = TestBed.createComponent(RectangleSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service.canvas = canvasTestHelper.canvas;
    service.previewCanvas = canvasTestHelper.canvas;
    service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    service = TestBed.inject(DrawingService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
