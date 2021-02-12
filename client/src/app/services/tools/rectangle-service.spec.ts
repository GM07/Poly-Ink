import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { RectangleMode, RectangleService } from './rectangle-service';

// tslint:disable:no-any
describe('RectangleService', () => {
    let service: RectangleService;
    let mouseEvent: MouseEvent;
    let keyboardEvent: KeyboardEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorService: ColorService;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawRectangleSpy: jasmine.Spy<any>;
    let updateRectangleSpy: jasmine.Spy<any>;

    const ALPHA = 3;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });

        colorService = TestBed.inject(ColorService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(RectangleService);
        drawRectangleSpy = spyOn<any>(service, 'drawRectangle').and.callThrough();
        updateRectangleSpy = spyOn<any>(service, 'updateRectangle').and.callThrough();

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;

        keyboardEvent = {
            shiftKey: true,
        } as KeyboardEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change the contour size', () => {
        service.contourWidth = 2;
        expect(service.contourWidth).toEqual(2);
        const max = 100;
        const min = 1;
        const overMax = 101;
        service.contourWidth = overMax;
        expect(service.contourWidth).toEqual(max);
        const underMin = 0;
        service.contourWidth = underMin;
        expect(service.contourWidth).toEqual(min);
    });

    it('should not draw when the mouse is up', () => {
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        expect(drawRectangleSpy).not.toHaveBeenCalled();
    });

    it('should start drawing when the mouse is down', () => {
        mouseEvent = { offsetX: 1, offsetY: 1, button: 3 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(drawRectangleSpy).not.toHaveBeenCalled();
        mouseEvent = { offsetX: 1, offsetY: 1, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('should stop drawing when the mouse is up', () => {
        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toEqual(false);
        service.onMouseDown(mouseEvent);
        mouseEvent = { x: -1, y: -1, offsetX: 1, offsetY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('should stop drawing when asked to', () => {
        service.mouseDown = true;
        service.onMouseDown(mouseEvent);
        service.stopDrawing();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should draw a preview when the mouse is moving with left click pressed', () => {
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 1, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });

    it('should update the rectangle when the mouse leaves', () => {
        service.onMouseLeave(mouseEvent);
        expect(updateRectangleSpy).not.toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 1, button: 0 } as MouseEvent;
        service.onMouseLeave(mouseEvent);
        expect(updateRectangleSpy).toHaveBeenCalled();
    });

    it('should update the rectangle when the mouse enters', () => {
        service.onMouseEnter(mouseEvent);
        expect(updateRectangleSpy).not.toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 1, button: 0 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(updateRectangleSpy).toHaveBeenCalled();
    });

    it('should update the rectangle to a square with shift pressed', () => {
        service.onKeyDown({} as KeyboardEvent);
        expect(updateRectangleSpy).not.toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyboardEvent);
        expect(updateRectangleSpy).toHaveBeenCalled();
    });

    it('should update the square to a rectangle with shift released', () => {
        service.onKeyUp({} as KeyboardEvent);
        expect(updateRectangleSpy).not.toHaveBeenCalled();
        service.onKeyDown(keyboardEvent);
        service.onKeyUp({ shiftKey: false } as KeyboardEvent);
        expect(updateRectangleSpy).not.toHaveBeenCalled();
        service.onKeyDown(keyboardEvent);
        service.onMouseDown(mouseEvent);
        keyboardEvent = { shiftKey: false } as KeyboardEvent;
        service.onKeyUp(keyboardEvent);
        expect(updateRectangleSpy).toHaveBeenCalled();
    });

    it('should allow for contour drawing type', () => {
        spyOnProperty(colorService, 'primaryRgba').and.returnValue('rgba(1, 1, 1, 1)');
        spyOnProperty(colorService, 'secondaryRgba').and.returnValue('rgba(0, 0, 0, 1');

        service.rectangleMode = RectangleMode.Contour;
        service.contourWidth = 1;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();

        // Border is present
        let imageData: ImageData = baseCtxStub.getImageData(1, 1, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A

        // Inside is untouched
        // tslint:disable-next-line:no-magic-numbers
        imageData = baseCtxStub.getImageData(2, 2, 20, 20);
        expect(imageData.data[ALPHA]).toEqual(0); // A
    });

    it('should allow for filled drawing type', () => {
        service.rectangleMode = RectangleMode.Filled;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();

        // tslint:disable-next-line:no-magic-numbers
        const imageData: ImageData = baseCtxStub.getImageData(1, 1, 25, 25);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should allow for filled with contour drawing type', () => {
        // Set primary color to black
        spyOnProperty(colorService, 'primaryRgba').and.returnValue('rgba(1, 1, 1, 1)');
        spyOnProperty(colorService, 'secondaryRgba').and.returnValue('rgba(0, 0, 0, 1');

        service.rectangleMode = RectangleMode.FilledWithContour;
        service.contourWidth = 1;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawRectangleSpy).toHaveBeenCalled();

        // Border is present
        let imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A

        // Inside is present
        // tslint:disable-next-line:no-magic-numbers
        imageData = baseCtxStub.getImageData(2, 2, 20, 20);
        expect(imageData.data[0]).toEqual(1); // R
        expect(imageData.data[1]).toEqual(1); // G
        expect(imageData.data[2]).toEqual(1); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should do nothing with an unknown mode', () => {
        service.rectangleMode = {} as RectangleMode;
        service.onMouseDown(mouseEvent);
        mouseEvent = { offsetX: 1, offsetY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // tslint:disable-next-line:no-magic-numbers
        const imageData = baseCtxStub.getImageData(1, 1, 25, 25);
        expect(imageData.data[ALPHA]).toEqual(0); // A
    });

    it('should draw a square when shift is pressed', () => {
        service.onKeyDown(keyboardEvent);
        service.rectangleMode = RectangleMode.Filled;
        service.onMouseDown(mouseEvent);
        // tslint:disable-next-line:no-magic-numbers
        mouseEvent = { offsetX: 20, offsetY: 5, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // tslint:disable-next-line:no-magic-numbers
        const imageData: ImageData = baseCtxStub.getImageData(20, 20, 5, 5);
        expect(imageData.data[0]).toEqual(0); // R
        expect(imageData.data[1]).toEqual(0); // G
        expect(imageData.data[2]).toEqual(0); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });
});
