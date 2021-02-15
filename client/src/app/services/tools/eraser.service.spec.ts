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
    let drawLineSpy: jasmine.Spy<any>;
    const WHITE = 255;
    const MIN_WIDTH = 5;
    const ALPHA = 3;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EraserService);
        drawLineSpy = spyOn<any>(service, 'drawLine').and.callThrough();

        // Configuration du spy du service
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
        expect(service.mouseDown).toEqual(true);
    });

    it(' mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it(' onMouseUp should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it(' onMouseUp should not call drawLine if mouse was not already down', () => {
        service.mouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it(' onMouseMove should call drawLine if mouse was already down', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        service.mouseDown = true;

        service.onMouseMove(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('should not erase a line between the points where it left and entered the canvas', () => {
        service.lineWidth = MIN_WIDTH;
        let mouseEventLClick: MouseEvent = { offsetX: 0, offsetY: 0, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseDown(mouseEventLClick);
        service.onMouseLeave(mouseEventLClick);
        mouseEventLClick = { offsetX: 0, offsetY: 50, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseEnter(mouseEventLClick);
        expect(drawLineSpy).toHaveBeenCalled();
        mouseEventLClick = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // tslint:disable-next-line:no-magic-numbers
        let imageData: ImageData = baseCtxStub.getImageData(0, 6, 1, 1);
        expect(imageData.data[0]).toEqual(0); // A, rien ne doit être dessiné
        imageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(WHITE); // R
        expect(imageData.data[1]).toEqual(WHITE); // G
        expect(imageData.data[2]).toEqual(WHITE); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
        // tslint:disable-next-line:no-magic-numbers
        imageData = baseCtxStub.getImageData(0, 50, 1, 1);
        expect(imageData.data[0]).toEqual(WHITE); // R
        expect(imageData.data[1]).toEqual(WHITE); // G
        expect(imageData.data[2]).toEqual(WHITE); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should stop erasing when the mouse is up', () => {
        let mouseEventLClick: MouseEvent = { offsetX: 0, offsetY: 0, button: 0, buttons: 1 } as MouseEvent;
        service.lineWidth = 1;
        service.onMouseDown(mouseEventLClick);
        service.onMouseLeave(mouseEventLClick);
        mouseEventLClick = { offsetX: 0, offsetY: 2, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseEnter(mouseEventLClick);
        expect(drawLineSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        const imageData: ImageData = baseCtxStub.getImageData(0, 1, 1, 1);
        expect(imageData.data[0]).toEqual(0); // A, rien ne doit être dessiné où on est entré

        service.mouseDown = true;
        mouseEventLClick = { x: 1000, y: 1000, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseUp(mouseEventLClick);
        expect(drawLineSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should do nothing when entering the canvas, with an unsupported mouse state', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, buttons: 3 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        mouseEvent = { offsetX: 0, offsetY: 0, button: 10, buttons: 3 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('should clear the canvas preview when the mouse leaves the canvas, left click released', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseLeave(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('Should only erase nothing on base canvas when moving the mouse, left click released', () => {
        service.mouseDown = false;
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0);
    });

    it('Should erase if the user clicked once with the smallest size, without moving', () => {
        service.lineWidth = MIN_WIDTH;
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { x: 0, y: 0, offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // Premier pixel seulement
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(WHITE); // R
        expect(imageData.data[1]).toEqual(WHITE); // G
        expect(imageData.data[2]).toEqual(WHITE); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should stop erasing when asked to', () => {
        service.stopDrawing();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    // Exemple de test d'intégration qui est quand même utile
    it(' should change the pixel of the canvas ', () => {
        mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // Premier pixel seulement
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(WHITE); // R
        expect(imageData.data[1]).toEqual(WHITE); // G
        expect(imageData.data[2]).toEqual(WHITE); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });
});
