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
  let abstractSelectionService: AbstractSelectionService;
  let mouseEvent = {
    offsetX: 25,
    offsetY: 25,
    button: 0,
} as MouseEvent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbstractSelectionComponent ],
      providers: [ AbstractSelectionService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    service = new DrawingService();
    canvasTestHelper = TestBed.inject(CanvasTestHelper);
    service = TestBed.inject(DrawingService);
    abstractSelectionService = TestBed.inject(AbstractSelectionService);
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

  it('it should disable control if in selection on mouse down', () => {
    spyOn(abstractSelectionService, 'isInSelection').and.returnValue(true);
    spyOn(component as any, 'makeControlsUnselectable');
    component.onMouseDown(mouseEvent);
    expect((component as any).makeControlsUnselectable).toHaveBeenCalled();
  });

  it('should update control points on mouse down', () => {
    let controlSaveBoolean = component.displayControlPoints = true;
    component.onMouseDown(mouseEvent);
    expect(controlSaveBoolean).not.toEqual(component.displayControlPoints);
  });

  it('should enable control point if there are control point', () => {
    component.displayControlPoints = true;
    spyOn(component as any, 'makeControlsSelectable');
    spyOn(component as any, 'placePoints');
    component.onMouseUp(mouseEvent);
    expect((component as any).makeControlsSelectable).toHaveBeenCalled();
    expect((component as any).placePoints).toHaveBeenCalled();
  });

  it('should update control points on mouse up', () => {
    let controlSaveBoolean = component.displayControlPoints = false;
    abstractSelectionService.selectionCtx = service.previewCtx;
    component.onMouseUp(mouseEvent);
    expect(controlSaveBoolean).not.toEqual(component.displayControlPoints);
  });

  it('should update the cursor when hovering the selection', () => {
    spyOn(abstractSelectionService, 'isInSelection').and.returnValue(true);
    component.onMouseMove(mouseEvent);
    expect(service.previewCanvas.style.cursor).toEqual('all-scroll');
  });

  it('should reset the cursor when not hovering the selection', () => {
    spyOn(abstractSelectionService, 'isInSelection').and.returnValue(false);
    (component as any).lastCursor = 'pointer';
    component.onMouseMove(mouseEvent);
    expect(service.previewCanvas.style.cursor).toEqual('pointer');
  });

  it('should do nothing if mouse is down and we\'re not diplaying the control points', () => {
    component.mouseDown = true;
    spyOn(component as any, 'placePoints');
    component.onMouseMove(mouseEvent);
    expect((component as any).placePoints).not.toHaveBeenCalled();
  });

});
