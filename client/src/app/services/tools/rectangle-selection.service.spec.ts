import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleSelectionService } from './rectangle-selection.service';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
describe('RectangleSelectionService', () => {
    let service: RectangleSelectionService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasSelection: HTMLCanvasElement;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    const mouseEvent = {
        x: 25,
        y: 25,
        offsetX: 25,
        offsetY: 25,
        button: 0,
    } as MouseEvent;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawigSnervice', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(RectangleSelectionService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasSelection = document.createElement('canvas');
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should draw set mouseDown and mouseUp to same coordinate on mouseDown outside of selection', () => {
        spyOn<any>(service, 'endSelection');
        spyOn<any>(service, 'drawPreviewSelection');
        spyOn(service, 'isInSelection').and.returnValue(false);
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(service.mouseUpCoord);
    });

    it('on mouse up should set mousePosition and clear canvas if in canvas', () => {
        service.mouseDown = true;
        spyOn<any>(service, 'getPositionFromMouse');
        spyOn(service, 'isInCanvas').and.returnValue(true);
        const startSelection = spyOn<any>(service, 'startSelection');
        service.onMouseUp(mouseEvent);
        expect(service.getPositionFromMouse).toHaveBeenCalled();
        expect(startSelection).toHaveBeenCalled();
    });

    it('on mouse up should move selection if canvas is set', () => {
        service.mouseDown = true;
        spyOn(service, 'isInCanvas').and.returnValue(false);
        spyOn<any>(service, 'getTranslation').and.returnValue({ x: 0, y: 0 } as Vec2);
        const updateSelection = spyOn<any>(service, 'updateSelection');
        service.selectionCtx = canvasSelection.getContext('2d');
        service.onMouseUp(mouseEvent);
        expect(updateSelection).toHaveBeenCalled();
    });

    it('should draw preview on mouse move', () => {
        service.mouseUpCoord = { x: 0, y: 0 } as Vec2;
        service.mouseDown = true;
        const drawPreviewSelection = spyOn<any>(service, 'drawPreviewSelection');
        spyOn(service, 'isInCanvas').and.returnValue(true);
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSelection).toHaveBeenCalled();
        expect(service.mouseUpCoord).not.toEqual({ x: 0, y: 0 } as Vec2);
    });

    it('should update the selection on mouse move if the selection is not null', () => {
        service.mouseDown = true;
        service.selectionCtx = canvasSelection.getContext('2d');
        const updateSelection = spyOn<any>(service, 'updateSelection');
        spyOn<any>(service, 'getTranslation');
        spyOn(service, 'isInCanvas').and.returnValue(false);
        service.onMouseMove(mouseEvent);
        expect(updateSelection).toHaveBeenCalled();
    });

    it('should stop drawing when the esc key is pressed', () => {
        const keyboardEvent = { key: 'escape', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        spyOn(service, 'stopDrawing');
        service.onKeyDown(keyboardEvent);
        expect(service.stopDrawing).toHaveBeenCalled();
    });

    it('should select all when alt+a is pressed', () => {
        const keyboardEvent = new KeyboardEvent('document:keydown', { key: 'a', ctrlKey: true, shiftKey: false, altKey: false });
        spyOn(service, 'selectAll');
        service.onKeyDown(keyboardEvent);
        expect(service.selectAll).toHaveBeenCalled();
    });

    it('should update the rectangle on shift pressed', () => {
        const keyboardEvent = { key: 'shift', ctrlKey: false, shiftKey: true, altKey: false } as KeyboardEvent;
        service.mouseDown = false;
        const updateDrawingSelection = spyOn<any>(service, 'updateDrawingSelection');
        service.onKeyDown(keyboardEvent);
        expect(updateDrawingSelection).not.toHaveBeenCalled();
        service.mouseDown = true;
        service.onKeyDown(keyboardEvent);
        expect(updateDrawingSelection).toHaveBeenCalled();
    });

    it('it should move the selection when there is a selection and an arrow is pressed', () => {
        jasmine.clock().install();
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'arrowdown' });
        const updateSelection = spyOn<any>(service, 'updateSelection');
        spyOn<any>(service, 'HorizontalTranslationModifier').and.returnValue(1);
        spyOn<any>(service, 'VerticalTranslationModifier').and.returnValue(1);
        service.selectionCtx = canvasSelection.getContext('2d');
        service.onKeyDown(keyboardEvent);
        jasmine.clock().tick(600);
        expect(updateSelection).toHaveBeenCalled();
        expect(updateSelection).toHaveBeenCalledTimes(2);
        jasmine.clock().uninstall();
    });

    it('should not move the selection multiple times if the key was pressed multiple times', () => {
        jasmine.clock().install();
        const updateSelection = spyOn<any>(service, 'updateSelection');
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'arrowdown' });
        service.selectionCtx = canvasSelection.getContext('2d');
        service.onKeyDown(keyboardEvent);
        jasmine.clock().tick(200);
        service['moveId'] = 1;
        jasmine.clock().tick(350);
        expect(updateSelection).toHaveBeenCalledTimes(1);
        jasmine.clock().uninstall();
    });

    it('should not move the selection if it is already moving', () => {
        jasmine.clock().install();
        const updateSelection = spyOn<any>(service, 'updateSelection');
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'arrowdown' });
        service.selectionCtx = canvasSelection.getContext('2d');
        service['moveId'] = 1;
        service.onKeyDown(keyboardEvent);
        jasmine.clock().tick(500);
        expect(updateSelection).toHaveBeenCalledTimes(1);
        jasmine.clock().uninstall();
    });

    it('should update the selection when key up', () => {
        const keyboardEvent = { key: 'shift', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        service['SHIFT'].isDown = true;
        service.mouseDown = false;
        const updateDrawingSelection = spyOn<any>(service, 'updateDrawingSelection');
        service.onKeyUp(keyboardEvent);
        expect(updateDrawingSelection).not.toHaveBeenCalled();
        service.mouseDown = true;
        service.onKeyUp(keyboardEvent);
        expect(updateDrawingSelection).toHaveBeenCalled();
    });

    it('should update arrowkey on key up', () => {
        const keyboardEvent = { ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        spyOn<any>(service, 'setArrowKeyUp');
        spyOn(window, 'clearInterval');
        service.selectionCtx = canvasSelection.getContext('2d');
        service.onKeyUp(keyboardEvent);
        expect(window.clearInterval).toHaveBeenCalled();
    });

    it('select all should set mouseDownCoord to upleft and mouseUp coord to bottom left', () => {
        drawServiceSpy.canvas = document.createElement('canvas');
        drawServiceSpy.canvas.width = 10;
        drawServiceSpy.canvas.height = 10;
        const mouseDown = { x: 0, y: 0 } as Vec2;
        const mouseUp = { x: drawServiceSpy.canvas.width, y: drawServiceSpy.canvas.height } as Vec2;
        spyOn<any>(service, 'stopDrawing');
        spyOn<any>(service, 'startSelection');
        service.selectAll();
        expect(mouseDown).toEqual(service.mouseDownCoord);
        expect(mouseUp).toEqual(service.mouseUpCoord);
    });

    it('should call endSelection and clear the preview on stop drawing', () => {
        const endSelection = spyOn<any>(service, 'endSelection');
        service.stopDrawing();
        expect(endSelection).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('start selection should do nothing if width or height is not set', () => {
        service.width = 0;
        const drawPreviewSelection = spyOn<any>(service, 'drawPreviewSelection');
        service['startSelection']();
        expect(drawPreviewSelection).not.toHaveBeenCalled();
    });

    it('start selection should init needed variables', () => {
        service.width = 100;
        service.height = 100;
        service.mouseDownCoord = { x: 25, y: 25 } as Vec2;
        service.selectionCtx = canvasSelection.getContext('2d');
        canvasSelection.width = 250;
        canvasSelection.height = 250;
        drawServiceSpy.previewCanvas = document.createElement('canvas');
        drawServiceSpy.previewCtx = drawServiceSpy.previewCanvas.getContext('2d') as CanvasRenderingContext2D;
        service['SELECTION_DATA'] = canvasSelection;
        const drawPreviewSelection = spyOn<any>(service, 'drawPreviewSelection');
        spyOn(drawServiceSpy.previewCtx, 'drawImage');
        spyOn<any>(service.selectionCtx, 'drawImage');
        service['startSelection']();
        expect(drawServiceSpy.previewCtx.drawImage).toHaveBeenCalled();
        expect(drawPreviewSelection).toHaveBeenCalled();
    });

    it('update drawing should clear canvas and draw new preview', () => {
        const drawPreviewSelection = spyOn<any>(service, 'drawPreviewSelection');
        service['updateDrawingSelection']();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawPreviewSelection).toHaveBeenCalled();
    });

    it('update selection should do nothing if there is no selection', () => {
        const translation = { x: 0, y: 0 } as Vec2;
        const updateSelectionRequired = spyOn<any>(service, 'updateSelectionRequired');
        service['updateSelection'](translation);
        expect(updateSelectionRequired).not.toHaveBeenCalled();
    });

    it('update selection should call the child class to update', () => {
        const translation = { x: 0, y: 0 } as Vec2;
        const updateSelectionRequired = spyOn<any>(service, 'updateSelectionRequired');
        service.selectionCoords = { x: 0, y: 0 } as Vec2;
        service['translationOrigin'] = { x: 0, y: 0 } as Vec2;
        service.selectionCtx = canvasSelection.getContext('2d');
        service['updateSelection'](translation);
        expect(updateSelectionRequired).toHaveBeenCalled();
    });

    it('draw preview should update width and height and call child method', () => {
        service.mouseUpCoord = { x: 25, y: 25 } as Vec2;
        service.mouseDownCoord = { x: 0, y: 0 } as Vec2;
        const drawPreviewSelectionRequired = spyOn<any>(service, 'drawPreviewSelectionRequired');
        service['drawPreviewSelection']();
        expect(service.width).toEqual(25);
        expect(service.height).toEqual(25);
        expect(drawPreviewSelectionRequired).toHaveBeenCalled();
    });

    it('isInCanvas should return true if is in canvas', () => {
        drawServiceSpy.canvas = document.createElement('canvas');
        spyOn(drawServiceSpy.canvas, 'getBoundingClientRect').and.returnValue({ x: 0, y: 0, width: 100, height: 100 } as DOMRect);
        expect(service.isInCanvas(mouseEvent)).toBeTruthy();
    });

    it('end selection should do nothing if there is no selection', () => {
        service['endSelection']();
        const fillBackground = spyOn<any>(service, 'fillBackground');
        expect(fillBackground).not.toHaveBeenCalled();
    });

    it('end selection should draw the selection on the base canvas', () => {
        service.selectionCtx = previewCtxStub;
        service.selectionCoords = { x: 0, y: 0 } as Vec2;
        spyOn(baseCtxStub, 'drawImage');
        const fillBackground = spyOn<any>(service, 'fillBackground');
        service['endSelection']();
        expect(baseCtxStub.drawImage).toHaveBeenCalled();
        expect(fillBackground).toHaveBeenCalled();
    });

    it('fill background should fill a rectangle at the location', () => {
        service['firstSelectionCoords'] = { x: 0, y: 0 } as Vec2;
        spyOn(previewCtxStub, 'fillRect');
        service['fillBackground'](previewCtxStub, { x: 10, y: 25 } as Vec2);
        expect(previewCtxStub.fillRect).toHaveBeenCalled();
    });

    it('update selection required should draw the image, update it and update the background', () => {
        service.selectionCoords = { x: 0, y: 0 } as Vec2;
        spyOn(previewCtxStub, 'drawImage');
        const fillBackground = spyOn<any>(service, 'fillBackground');
        const drawSelection = spyOn<any>(service, 'drawSelection');
        service['updateSelectionRequired']();
        expect(previewCtxStub.drawImage).toHaveBeenCalled();
        expect(fillBackground).toHaveBeenCalled();
        expect(drawSelection).toHaveBeenCalled();
    });

    it('drawSelection should call drawPreview and not change size if shift hasnt changed', () => {
        const drawSelection = spyOn<any>(service, 'drawSelection');
        const saveWidth = (service.width = 5);
        const saveHeight = (service.height = 25);
        service.mouseDownCoord = { x: 0, y: 0 } as Vec2;
        service['drawPreviewSelectionRequired']();
        expect(saveWidth).toEqual(service.width);
        expect(saveHeight).toEqual(service.height);
        expect(drawSelection).toHaveBeenCalled();
    });

    it('drawSelection should call drawPreview and change size if shift has changed', () => {
        const drawSelection = spyOn<any>(service, 'drawSelection');
        const saveWidth = (service.width = 5);
        const saveHeight = (service.height = 25);
        service['SHIFT'].isDown = true;
        service.mouseDownCoord = { x: 0, y: 0 } as Vec2;
        service['drawPreviewSelectionRequired']();
        expect(saveWidth).toEqual(service.width);
        expect(saveHeight).not.toEqual(service.height);
        expect(drawSelection).toHaveBeenCalled();
    });

    it('draw selection should draw a rectangle and a border around the selection', () => {
        spyOn(baseCtxStub, 'strokeRect');
        spyOn(baseCtxStub, 'setLineDash');
        service['drawSelection'](baseCtxStub, { x: 10, y: 25 } as Vec2, 0, 0);
        expect(baseCtxStub.strokeRect).toHaveBeenCalledTimes(2);
        expect(baseCtxStub.setLineDash).toHaveBeenCalledTimes(2);
    });

    it("fill background should do nothing if the mouse hasn't move", () => {
        service['firstSelectionCoords'] = { x: 0, y: 0 };
        spyOn(previewCtxStub, 'beginPath');
        service['fillBackground'](previewCtxStub, { x: 0, y: 0 } as Vec2);
        expect(previewCtxStub.beginPath).not.toHaveBeenCalled();
    });
});