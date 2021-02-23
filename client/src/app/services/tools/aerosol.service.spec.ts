import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { AerosolService } from '@app/services/tools/aerosol.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { DrawingService } from '../drawing/drawing.service';


describe('AerosolService', () => {
  let service: AerosolService;
  let mouseEvent: MouseEvent;
  let canvasTestHelper: CanvasTestHelper;
  let drawServiceSpy: jasmine.SpyObj<DrawingService>;
  let colorServiceSpy: jasmine.SpyObj<ColorService>;

  let baseCtxStub: CanvasRenderingContext2D;
  let previewCtxStub: CanvasRenderingContext2D;
  let drawSpraySpy: jasmine.Spy<any>;
  let sprayContinuouslySpy: jasmine.Spy<any>;

  const ALPHA = 3;

  beforeEach(() => {
    drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
    colorServiceSpy = jasmine.createSpyObj('ColorService', [], { primaryRgba: 'rgba(0, 0, 0, 1)' });
    
    TestBed.configureTestingModule({
      providers: [
        { provide: DrawingService, useValue: drawServiceSpy },
        { provide: ColorService, useValue: colorServiceSpy },
      ],
    });
    canvasTestHelper = TestBed.inject(CanvasTestHelper);
    baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
    previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

    service = TestBed.inject(AerosolService);
    drawSpraySpy = spyOn<any>(service, 'drawSpray').and.callThrough();
    sprayContinuouslySpy = spyOn<any>(service, 'sprayContinuously').and.callThrough();
  
    // Configuration du spy du service
    // tslint:disable:no-string-literal
    service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
    service['drawingService'].previewCtx = previewCtxStub;
    service['drawingService'].canvas = canvasTestHelper.canvas;

    mouseEvent = {
      offsetX: 25,
      offsetY: 25,
      button: 0,
    } as MouseEvent;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(' mouseDown should set mouseDownCoord to correct position', () => {
    const expectedResult: Vec2 = { x: 25, y: 25 };
    service.onMouseDown(mouseEvent);
    expect(service.mouseDownCoord).toEqual(expectedResult);
    window.clearInterval(service.sprayIntervalID);
  });

  it(' mouseDown should set mouseDown property to true on left click', () => {
    service.onMouseDown(mouseEvent);
    expect(service.mouseDown).toEqual(true);
    window.clearInterval(service.sprayIntervalID);
  });

  it(' mouseDown should set mouseDown property to false on right click', () => {
    const mouseEventRClick = {
      offsetX: 25,
      offsetY: 25,
      button: 1,
    } as MouseEvent;
    service.onMouseDown(mouseEventRClick);
    expect(service.mouseDown).toEqual(false);
    window.clearInterval(service.sprayIntervalID);
  });

  it(' onMouseUp should call drawSpray if mouse was already down', () => {
    service.mouseDownCoord = { x: 0, y: 0 };
    service.mouseDown = true;

    service.onMouseUp(mouseEvent);
    expect(drawSpraySpy).toHaveBeenCalled();
  });

  it(' onMouseUp should not call drawSpray if mouse was not already down', () => {
    service.mouseDown = false;
    service.mouseDownCoord = { x: 0, y: 0 };

    service.onMouseUp(mouseEvent);
    expect(drawSpraySpy).not.toHaveBeenCalled();
  });

  it(' onMouseMove should call drawSpray if mouse was already down', () => {
    service.mouseDownCoord = { x: 0, y: 0 };
    service.mouseDown = true;

    service.onMouseMove(mouseEvent);
    expect(drawSpraySpy).toHaveBeenCalled();
    window.clearInterval(service.sprayIntervalID);
  });

  /* TODO
  it('should not spray between the points where it left and entered the canvas', () => {
    service.areaDiameter = 2;
    let mouseEventLClick: MouseEvent = { offsetX: 0, offsetY: 0, button: 0, buttons: 1 } as MouseEvent;
    service.onMouseDown(mouseEventLClick);
    service.onMouseLeave(mouseEventLClick);
    mouseEventLClick = { offsetX: 0, offsetY: 50, button: 0, buttons: 1 } as MouseEvent;
    service.onMouseEnter(mouseEventLClick);
    expect(drawSpraySpy).toHaveBeenCalled();
    mouseEventLClick = { offsetX: 0, offsetY: 50, button: 0 } as MouseEvent;
    service.onMouseUp(mouseEventLClick);

    // tslint:disable-next-line:no-magic-numbers
    let imageData: ImageData = baseCtxStub.getImageData(2, 2, 25, 25);
    expect(imageData.data[ALPHA]).toEqual(0); // A, rien ne doit être dessiné
    imageData = baseCtxStub.getImageData(0, 0, 1, 1);
    expect(imageData.data[0]).toEqual(0); // R
    expect(imageData.data[1]).toEqual(0); // G
    expect(imageData.data[2]).toEqual(0); // B
    expect(imageData.data[ALPHA]).not.toEqual(0); // A
    // tslint:disable-next-line:no-magic-numbers
    imageData = baseCtxStub.getImageData(0, 50, 1, 1);
    expect(imageData.data[0]).toEqual(0); // R
    expect(imageData.data[1]).toEqual(0); // G
    expect(imageData.data[2]).toEqual(0); // B
    //expect(imageData.data[ALPHA]).not.toEqual(0); // A
  });*/

  it('should stop drawing when the mouse is up', () => {
    let mouseEventLClick: MouseEvent = { offsetX: 0, offsetY: 0, button: 0, buttons: 1 } as MouseEvent;
    service.areaDiameter = 1;
    service.onMouseDown(mouseEventLClick);
    service.onMouseLeave(mouseEventLClick);
    mouseEventLClick = { offsetX: 0, offsetY: 2, button: 0, buttons: 0 } as MouseEvent;
    service.onMouseEnter(mouseEventLClick);
    expect(sprayContinuouslySpy).toHaveBeenCalled();
    expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    const imageData: ImageData = baseCtxStub.getImageData(0, 1, 1, 1);
    expect(imageData.data[ALPHA]).toEqual(0); // A, rien ne doit être dessiné où on est entré

    service.mouseDown = true;
    mouseEventLClick = { x: 1000, y: 1000, button: 0, buttons: 0 } as MouseEvent;
    service.onMouseUp(mouseEventLClick);
    expect(sprayContinuouslySpy).toHaveBeenCalled();
    expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
  });

  it('should do nothing when entering the canvas, with an unsupported mouse state', () => {
    mouseEvent = { offsetX: 0, offsetY: 0, button: 0, buttons: 3 } as MouseEvent;
    service.onMouseEnter(mouseEvent);
    expect(drawSpraySpy).not.toHaveBeenCalled();
    expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    mouseEvent = { offsetX: 0, offsetY: 0, button: 10, buttons: 3 } as MouseEvent;
    service.onMouseEnter(mouseEvent);
    expect(drawSpraySpy).not.toHaveBeenCalled();
    expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
  });

  it('should clear the canvas preview when the mouse leaves the canvas, left click released', () => {
    mouseEvent = { offsetX: 0, offsetY: 0, button: 0, buttons: 0 } as MouseEvent;
    service.onMouseLeave(mouseEvent);
    expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
  });

  it('Should only draw nothing on base canvas when moving the mouse, left click released', () => {
    service.mouseDown = false;
    mouseEvent = { offsetX: 0, offsetY: 0, button: 0, buttons: 0 } as MouseEvent;
    service.onMouseMove(mouseEvent);
    const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
    expect(imageData.data[ALPHA]).toEqual(0);
    window.clearInterval(service.sprayIntervalID);
  });

  it('should stop drawing when asked to', () => {
    service.stopDrawing();
    expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
});

});
