import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { PencilService } from './pencil.service';

// tslint:disable:no-any
describe('PencilService', () => {
    let service: PencilService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawLineSpy: jasmine.Spy<any>;

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

        service = TestBed.inject(PencilService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        mouseEvent = {
            pageX: 25,
            pageY: 25,
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
    });

    it(' mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.leftMouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            pageX: 25,
            pageY: 25,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.leftMouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.leftMouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.leftMouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.leftMouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('should not draw a line between the points where it left and entered the canvas', () => {
        service.lineWidth = 2;
        let mouseEventLClick: MouseEvent = { pageX: 0, pageY: 0, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseDown(mouseEventLClick);
        service.onMouseLeave();
        mouseEventLClick = { pageX: 0, pageY: 50, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseEnter(mouseEventLClick);
        expect(drawLineSpy).toHaveBeenCalled();
        mouseEventLClick = { pageX: 0, pageY: 50, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEventLClick);

        // tslint:disable-next-line:no-magic-numbers
        let imageData: ImageData = baseCtxStub.getImageData(2, 2, 25, 25);
        expect(imageData.data[ALPHA]).toEqual(0); // A, nothing should be drawn
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
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should stop drawing when the mouse is up', () => {
        let mouseEventLClick: MouseEvent = { pageX: 0, pageY: 0, button: 0, buttons: 1 } as MouseEvent;
        service.lineWidth = 1;
        service.onMouseDown(mouseEventLClick);
        service.onMouseLeave();
        mouseEventLClick = { pageX: 0, pageY: 2, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseEnter(mouseEventLClick);
        expect(drawLineSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        const imageData: ImageData = baseCtxStub.getImageData(0, 1, 1, 1);
        expect(imageData.data[ALPHA]).toEqual(0); // A, nothing should be drawn where mouse entered

        service.leftMouseDown = true;
        mouseEventLClick = { x: 1000, y: 1000, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseUp(mouseEventLClick);
        expect(drawLineSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should do nothing when entering the canvas, with an unsupported mouse state', () => {
        mouseEvent = { pageX: 0, pageY: 0, button: 0, buttons: 3 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        mouseEvent = { pageX: 0, pageY: 0, button: 10, buttons: 3 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('should clear the canvas preview when the mouse leaves the canvas, left click released', () => {
        mouseEvent = { pageX: 0, pageY: 0, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseLeave();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('Should only draw nothing on base canvas when moving the mouse, left click released', () => {
        service.leftMouseDown = false;
        mouseEvent = { pageX: 0, pageY: 0, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[ALPHA]).toEqual(0);
    });

    it('Should draw a single pixel if the user clicked once with the smallest size, without moving', () => {
        service.lineWidth = 1;
        mouseEvent = { pageX: 0, pageY: 0, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { x: 0, y: 0, pageX: 0, pageY: 0, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // First pixel only
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should stop drawing when asked to', () => {
        service.stopDrawing();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('verifies if it is a point', () => {
        let point: Vec2[] = {} as Vec2[];
        expect(PencilService['isAPoint'](point)).toBeFalsy();
        point = [{ x: 1, y: 1 }] as Vec2[];
        expect(PencilService['isAPoint'](point)).toBeTruthy();
    });

    // Useful integration test example
    it(' should change the pixel of the canvas ', () => {
        mouseEvent = { pageX: 0, pageY: 0, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { pageX: 1, pageY: 0, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // First pixel only
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('preview should not appear if outside of canvas', () => {
        spyOn(service, 'getPositionFromMouse');
        spyOn(service, 'isInCanvas').and.returnValue(false);
        service.onMouseMove({} as MouseEvent);
        expect(service.getPositionFromMouse).not.toHaveBeenCalled();
    });
});
