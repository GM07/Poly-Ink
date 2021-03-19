import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShapeMode } from '@app/services/tools/abstract-shape.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { RectangleService } from './rectangle.service';

// tslint:disable:no-any
describe('RectangleService', () => {
    let service: RectangleService;
    let mouseEvent: MouseEvent;
    let keyboardEvent: KeyboardEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawShapeSpy: jasmine.Spy<any>;
    let updateShapeSpy: jasmine.Spy<any>;

    const ALPHA = 3;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', [], { primaryRgba: 'rgba(1, 1, 1, 1)', secondaryRgba: 'rgba(0, 0, 0, 1)' });

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorService, useValue: colorServiceSpy },
            ],
        });

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(RectangleService);
        drawShapeSpy = spyOn<any>(service, 'drawShape').and.callThrough();
        updateShapeSpy = spyOn<any>(service, 'updateShape').and.callThrough();

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        mouseEvent = {
            clientX: 25,
            clientY: 25,
            button: 0,
        } as MouseEvent;

        keyboardEvent = {
            key: 'Shift',
            shiftKey: true,
        } as KeyboardEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change the contour size', () => {
        service.contourWidth = 2;
        expect(service.contourWidth).toEqual(2);
        const max = 50;
        const min = 1;
        const overMax = 51;
        service.contourWidth = overMax;
        expect(service.contourWidth).toEqual(max);
        const underMin = 0;
        service.contourWidth = underMin;
        expect(service.contourWidth).toEqual(min);
    });

    it('should not draw when the mouse is up', () => {
        service.leftMouseDown = false;
        service.onMouseMove(mouseEvent);
        expect(drawShapeSpy).not.toHaveBeenCalled();
    });

    it('should start drawing when the mouse is down', () => {
        mouseEvent = { clientX: 1, clientY: 1, button: 3 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(drawShapeSpy).not.toHaveBeenCalled();
        mouseEvent = { clientX: 1, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(drawShapeSpy).toHaveBeenCalled();
    });

    it('should stop drawing when the mouse is up', () => {
        service.onMouseUp(mouseEvent);
        expect(service.leftMouseDown).toEqual(false);
        service.onMouseDown(mouseEvent);
        mouseEvent = { x: -1, y: -1, clientX: 1, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawShapeSpy).toHaveBeenCalled();
    });

    it('should stop drawing when asked to', () => {
        service.leftMouseDown = true;
        service.onMouseDown(mouseEvent);
        service.stopDrawing();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should draw a preview when the mouse is moving with left click pressed', () => {
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 1, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawShapeSpy).toHaveBeenCalled();
    });

    it('should update the rectangle when the mouse leaves', () => {
        service.onMouseLeave();
        expect(updateShapeSpy).not.toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 1, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseLeave();
        expect(updateShapeSpy).toHaveBeenCalled();
    });

    it('should update the rectangle when the mouse enters', () => {
        service.onMouseEnter();
        expect(updateShapeSpy).not.toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 1, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseEnter();
        expect(updateShapeSpy).toHaveBeenCalled();
    });

    it('should update the rectangle to a square with shift pressed', () => {
        service.onKeyDown({} as KeyboardEvent);
        expect(updateShapeSpy).not.toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyboardEvent);
        expect(updateShapeSpy).toHaveBeenCalled();
    });

    it('should update the square to a rectangle with shift released', () => {
        service.onKeyUp({} as KeyboardEvent);
        expect(updateShapeSpy).not.toHaveBeenCalled();
        service.onKeyDown(keyboardEvent);
        service.onKeyUp({ shiftKey: false, key: 'Shift' } as KeyboardEvent);
        expect(updateShapeSpy).not.toHaveBeenCalled();
        service.onKeyDown(keyboardEvent);
        service.onMouseDown(mouseEvent);
        keyboardEvent = { shiftKey: false, key: 'Shift' } as KeyboardEvent;
        service.onKeyUp(keyboardEvent);
        expect(updateShapeSpy).toHaveBeenCalled();
    });

    it('should allow for contour drawing type', () => {
        service.shapeMode = ShapeMode.Contour;
        service.contourWidth = 1;
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 1, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawShapeSpy).toHaveBeenCalled();

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
        service.shapeMode = ShapeMode.Filled;
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 1, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawShapeSpy).toHaveBeenCalled();

        // tslint:disable-next-line:no-magic-numbers
        const imageData: ImageData = baseCtxStub.getImageData(1, 1, 25, 25);
        expect(imageData.data[0]).toEqual(1); // R
        expect(imageData.data[1]).toEqual(1); // G
        expect(imageData.data[2]).toEqual(1); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should allow for filled with contour drawing type', () => {
        service.shapeMode = ShapeMode.FilledWithContour;
        service.contourWidth = 2;
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 1, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawShapeSpy).toHaveBeenCalled();

        // Border is present
        let imageData: ImageData = baseCtxStub.getImageData(1, 1, 1, 1);
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
        service.shapeMode = {} as ShapeMode;
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 1, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // tslint:disable-next-line:no-magic-numbers
        const imageData = baseCtxStub.getImageData(1, 1, 25, 25);
        expect(imageData.data[ALPHA]).toEqual(0); // A
    });

    it('should draw a square when shift is pressed', () => {
        service.onKeyDown(keyboardEvent);
        service.shapeMode = ShapeMode.Filled;
        service.onMouseDown(mouseEvent);
        // tslint:disable-next-line:no-magic-numbers
        mouseEvent = { clientX: 20, clientY: 5, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // tslint:disable-next-line:no-magic-numbers
        const imageData: ImageData = baseCtxStub.getImageData(20, 20, 5, 5);
        expect(imageData.data[0]).toEqual(1); // R
        expect(imageData.data[1]).toEqual(1); // G
        expect(imageData.data[2]).toEqual(1); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });
});
