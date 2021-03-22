import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
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
    let drawSpy: jasmine.Spy<any>;
    let drawPreviewSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'draw', 'drawPreview', 'blockUndoRedo']);
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
        drawSpy = spyOn<any>(service, 'draw').and.stub();
        drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.stub();

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
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it('should start drawing when the mouse is down', () => {
        mouseEvent = { clientX: 1, clientY: 1, button: 3 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        mouseEvent = { x: 1, y: 1, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('should stop drawing when the mouse is up', () => {
        service.onMouseUp(mouseEvent);
        expect(service.leftMouseDown).toEqual(false);
        service.onMouseDown(mouseEvent);
        mouseEvent = { x: -1, y: -1, clientX: 1, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
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
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('should update the rectangle when the mouse leaves', () => {
        service.onMouseLeave({} as MouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 1, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseLeave({} as MouseEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('should not update rectangle end coordinates to mousePosition when mouseup outside canvas', () => {
        mouseEvent = {
            offsetX: baseCtxStub.canvas.width + 1,
            offsetY: baseCtxStub.canvas.width + 1,
            button: 0,
        } as MouseEvent;
        service.leftMouseDown = true;
        service.onMouseUp(mouseEvent);
        spyOn(service, 'getPositionFromMouse').and.stub();
        expect(service.getPositionFromMouse).not.toHaveBeenCalled();
    });

    it('should update the rectangle when the mouse enters', () => {
        service.onMouseEnter({} as MouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 1, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseEnter({} as MouseEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('should update the rectangle to a square with shift pressed', () => {
        service.onKeyDown({} as KeyboardEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        service.onKeyDown(keyboardEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('should update the square to a rectangle with shift released', () => {
        service.onKeyUp({} as KeyboardEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        service.onKeyDown(keyboardEvent);
        service.onKeyUp({ shiftKey: false, key: 'Shift' } as KeyboardEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        service.onKeyDown(keyboardEvent);
        service.onMouseDown(mouseEvent);
        keyboardEvent = { shiftKey: false, key: 'Shift' } as KeyboardEvent;
        service.onKeyUp(keyboardEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
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
