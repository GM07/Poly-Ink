import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { AbstractSelectionComponent } from './abstract-selection.component';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';

describe('AbstractSelectionComponent', () => {
  let component: AbstractSelectionComponent;
  let fixture: ComponentFixture<AbstractSelectionComponent>;
  let canvasTestHelper: CanvasTestHelper;
  let service: DrawingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbstractSelectionComponent ],
      providers: [ AbstractSelectionService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    canvasTestHelper = TestBed.inject(CanvasTestHelper);
    service = TestBed.inject(DrawingService);
    fixture = TestBed.createComponent(AbstractSelectionComponent);
    component = fixture.componentInstance;
    service.canvas = canvasTestHelper.canvas;
    service.previewCanvas = canvasTestHelper.canvas;
    service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
