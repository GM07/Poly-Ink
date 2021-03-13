import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EraserService } from './eraser.service';

// tslint:disable:no-any
describe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawSpy: jasmine.Spy<any>;
    let drawPreviewSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'draw', 'drawPreview']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EraserService);
        drawSpy = spyOn<any>(service, 'draw').and.stub();
        drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.stub();

        // Configuration of the service spy
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        baseCtxStub.fillStyle = 'black';
        baseCtxStub.fillRect(0, 0, canvasTestHelper.canvas.width, canvasTestHelper.canvas.height);
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
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.leftMouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.leftMouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.leftMouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.leftMouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('should not erase a line between the points where it left and entered the canvas', () => {
        const firstClickOffset: Vec2 = { x: 0, y: 0 };
        const lastClickOffset: Vec2 = { x: 0, y: 50 };
        service.lineWidth = 2;
        let mouseEventLClick: MouseEvent = { offsetX: firstClickOffset.x, offsetY: firstClickOffset.y, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseDown(mouseEventLClick);
        service.onMouseLeave(mouseEventLClick);
        mouseEventLClick = { offsetX: lastClickOffset.x, offsetY: lastClickOffset.y, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseEnter(mouseEventLClick);
        expect(drawPreviewSpy).toHaveBeenCalled();
        expect(service.config.pathData[0][0]).toEqual(firstClickOffset);
        expect(service.config.pathData[1][0]).toEqual(lastClickOffset);
    });

    it('should stop erasing when the mouse is up', () => {
        let mouseEventLClick: MouseEvent = { offsetX: 0, offsetY: 0, button: 0, buttons: 1 } as MouseEvent;
        service.lineWidth = 1;
        service.onMouseDown(mouseEventLClick);
        service.onMouseLeave(mouseEventLClick);
        mouseEventLClick = { offsetX: 0, offsetY: 2, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseEnter(mouseEventLClick);
        expect(drawPreviewSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        const imageData: ImageData = baseCtxStub.getImageData(0, 1, 1, 1);
        expect(imageData.data[0]).toEqual(0); // A, nothing should be drawn where mouse entered

        service.leftMouseDown = true;
        mouseEventLClick = { x: 1000, y: 1000, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseUp(mouseEventLClick);
        expect(drawSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should do nothing when entering the canvas, with an unsupported mouse state', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, buttons: 3 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        mouseEvent = { offsetX: 0, offsetY: 0, button: 10, buttons: 3 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('should clear the canvas preview when the mouse leaves the canvas, left click released', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseLeave(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('Should only erase nothing on base canvas when moving the mouse, left click released', () => {
        service.leftMouseDown = false;
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0);
    });

    it('should stop erasing when asked to', () => {
        service.stopDrawing();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should send command to drawing service to draw on preview', () => {
        drawPreviewSpy.and.callThrough();
        service.drawPreview();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
    });

    it('should send command to drawing service to draw on base', () => {
        drawSpy.and.callThrough();
        service.draw();
        expect(drawServiceSpy.draw).toHaveBeenCalled();
    });
});
