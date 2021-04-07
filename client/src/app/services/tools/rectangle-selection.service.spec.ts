import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { RectangleSelectionDraw } from '@app/classes/commands/rectangle-selection-draw';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';
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
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'draw', 'drawPreview', 'blockUndoRedo', 'unblockUndoRedo'], {
            changes: new Subject<void>(),
        });
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(RectangleSelectionService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasSelection = document.createElement('canvas');
        service['drawingService'].canvas = canvasTestHelper.canvas;
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should draw and set mouseDown and mouseUp to same coordinate on mouseDown outside of selection', () => {
        spyOn<any>(service, 'endSelection');
        spyOn<any>(service, 'drawPreviewSelection');
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownCoord).toEqual(service.mouseUpCoord);
    });

    it('on mouse up should set mousePosition and clear canvas if in canvas', () => {
        service.leftMouseDown = true;
        spyOn<any>(service, 'getPositionFromMouse');
        spyOn(service, 'isInCanvas').and.returnValue(true);
        const startSelection = spyOn<any>(service, 'startSelection');
        service.onMouseUp(mouseEvent);
        expect(service.getPositionFromMouse).toHaveBeenCalled();
        expect(startSelection).toHaveBeenCalled();
    });

    it('should draw preview on mouse move', () => {
        service.mouseUpCoord = new Vec2(0, 0);
        service.leftMouseDown = true;
        const drawPreviewSelection = spyOn<any>(service, 'drawPreviewSelection');
        spyOn(service, 'isInCanvas').and.returnValue(true);
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSelection).toHaveBeenCalled();
        expect(service.mouseUpCoord).not.toEqual(new Vec2(0, 0));
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
        service.leftMouseDown = false;
        const updateDrawingSelection = spyOn<any>(service, 'updateDrawingSelection');
        service.onKeyDown(keyboardEvent);
        expect(updateDrawingSelection).not.toHaveBeenCalled();
        service.leftMouseDown = true;
        service.onKeyDown(keyboardEvent);
        expect(updateDrawingSelection).toHaveBeenCalled();
    });

    it('should update the selection when key up', () => {
        const keyboardEvent = { key: 'shift', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        service.config.shift.isDown = true;
        service.leftMouseDown = false;
        const updateDrawingSelection = spyOn<any>(service, 'updateDrawingSelection');
        service.onKeyUp(keyboardEvent);
        expect(updateDrawingSelection).not.toHaveBeenCalled();
        service.leftMouseDown = true;
        service.onKeyUp(keyboardEvent);
        expect(updateDrawingSelection).toHaveBeenCalled();
    });

    it('should update arrowkey on key up', () => {
        const keyboardEvent = { ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
        spyOn<any>(service['selectionTranslation'], 'setArrowKeyUp');
        spyOn(window, 'clearInterval');
        service['config'].previewSelectionCtx = canvasSelection.getContext('2d');
        service.onKeyUp(keyboardEvent);
        expect(window.clearInterval).toHaveBeenCalled();
    });

    it('select all should set mouseDownCoord to upleft and mouseUp coord to bottom left', () => {
        drawServiceSpy.canvas = document.createElement('canvas');
        drawServiceSpy.canvas.width = 10;
        drawServiceSpy.canvas.height = 10;
        const mouseDown = new Vec2(0, 0);
        const mouseUp = new Vec2(drawServiceSpy.canvas.width, drawServiceSpy.canvas.height);
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
        service.config.width = 0;
        const drawPreviewSelection = spyOn<any>(service, 'drawPreviewSelection');
        service['startSelection']();
        expect(drawServiceSpy.unblockUndoRedo).toHaveBeenCalled();
        expect(drawPreviewSelection).not.toHaveBeenCalled();
    });

    it('start selection should init needed variables', () => {
        service.config.width = 100;
        service.config.height = 100;
        service.mouseDownCoord = new Vec2(25, 25);
        const updateSelectionRequiredSpy = spyOn<any>(service, 'updateSelectionRequired');
        const drawImageSpy = spyOn<any>(service['config'].SELECTION_DATA.getContext('2d'), 'drawImage');
        service['startSelection']();
        expect(drawImageSpy).toHaveBeenCalled();
        expect(updateSelectionRequiredSpy).toHaveBeenCalled();
    });

    it('update drawing should clear canvas and draw new preview', () => {
        const drawPreviewSelection = spyOn<any>(service, 'drawPreviewSelection');
        service['updateDrawingSelection']();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(drawPreviewSelection).toHaveBeenCalled();
    });

    it('update selection should do nothing if there is no selection', () => {
        const translation = new Vec2(0, 0);
        const drawImageSpy = spyOn(service['drawingService'].previewCtx, 'drawImage');
        service['updateSelection'](translation);
        expect(drawImageSpy).not.toHaveBeenCalled();
    });

    it('update selection should call the child class to update', () => {
        const translation = new Vec2(0, 0);
        const drawImageSpy = spyOn(service['drawingService'].previewCtx, 'drawImage');
        service.config.endCoords = new Vec2(0, 0);
        service['config'].previewSelectionCtx = canvasSelection.getContext('2d');
        service['updateSelection'](translation);
        expect(drawImageSpy).toHaveBeenCalled();
    });

    it('draw preview should update width and height', () => {
        service.mouseUpCoord = new Vec2(25, 25);
        service.mouseDownCoord = new Vec2(0, 0);
        service['drawPreviewSelection']();
        expect(service.config.width).toEqual(25);
        expect(service.config.height).toEqual(25);
    });

    it('isInCanvas should return true if is in canvas', () => {
        drawServiceSpy.canvas = document.createElement('canvas');
        spyOn(drawServiceSpy.canvas, 'getBoundingClientRect').and.returnValue({ x: 0, y: 0, width: 100, height: 100 } as DOMRect);
        expect(service.isInCanvas(mouseEvent)).toBeTruthy();
    });

    it('end selection should do nothing if there is no selection', () => {
        spyOn(service.config, 'didChange').and.returnValue(false);
        const fillBackground = spyOn<any>(service, 'fillBackground');
        service['endSelection']();
        expect(fillBackground).not.toHaveBeenCalled();
    });

    it('end selection should draw the selection on the base canvas', () => {
        service['config'].previewSelectionCtx = previewCtxStub;
        service.config.endCoords = new Vec2(0, 0);
        spyOn(service, 'draw');
        service['endSelection']();
        expect(service.draw).toHaveBeenCalled();
    });

    it('fill background should fill a rectangle at the location', () => {
        spyOn(service.config, 'didChange').and.returnValue(true);
        service.config.startCoords = new Vec2(0, 0);
        spyOn(previewCtxStub, 'fillRect');
        service['fillBackground'](previewCtxStub);
        expect(previewCtxStub.fillRect).toHaveBeenCalled();
    });

    it('the updated drawn selection should draw the image and update it', () => {
        service.config.endCoords = new Vec2(0, 0);
        const drawClippedSelectionSpy = spyOn(RectangleSelectionDraw, 'drawClippedSelection');
        const drawSelection = spyOn<any>(service, 'drawSelection');
        service['updateSelectionRequired']();
        expect(drawSelection).toHaveBeenCalled();
        expect(drawClippedSelectionSpy).toHaveBeenCalled();
    });

    it('drawSelection should call drawPreview and not change size if shift has not changed', () => {
        const drawSelection = spyOn<any>(service, 'drawSelection');
        const saveWidth = (service.config.width = 5);
        const saveHeight = (service.config.height = 25);
        service.mouseDownCoord = new Vec2(0, 0);
        service.mouseUpCoord = new Vec2(5, 25);
        service.config.shift.isDown = false;
        service['drawPreviewSelection']();
        expect(saveWidth).toEqual(service.config.width);
        expect(saveHeight).toEqual(service.config.height);
        expect(drawSelection).toHaveBeenCalled();
    });

    it('drawSelection should call drawPreview and change size if shift has changed', () => {
        const drawSelection = spyOn<any>(service, 'drawSelection');
        const saveWidth = (service.config.width = 5);
        const saveHeight = (service.config.height = 25);
        service.mouseUpCoord = new Vec2(5, 25);
        service.mouseDownCoord = new Vec2(0, 0);
        service.config.shift.isDown = true;
        service['drawPreviewSelection']();
        expect(saveWidth).toEqual(service.config.width);
        expect(saveHeight).not.toEqual(service.config.height);
        expect(drawSelection).toHaveBeenCalled();
    });

    it('draw selection should draw a rectangle and a border around the selection', () => {
        spyOn(baseCtxStub, 'strokeRect');
        spyOn(baseCtxStub, 'setLineDash');
        service['drawSelection'](baseCtxStub, new Vec2(10, 25), new Vec2(0, 0));
        expect(baseCtxStub.strokeRect).toHaveBeenCalledTimes(2);
        expect(baseCtxStub.setLineDash).toHaveBeenCalledTimes(2);
    });

    it('fill background should do nothing if the mouse has not moved', () => {
        service.config.startCoords = new Vec2(0, 0);
        spyOn(service.config, 'didChange').and.returnValue(false);
        spyOn(previewCtxStub, 'beginPath');
        service['fillBackground'](previewCtxStub);
        expect(previewCtxStub.beginPath).not.toHaveBeenCalled();
    });

    it('should send command to drawing service to draw on base', () => {
        service.draw();
        expect(drawServiceSpy.draw).toHaveBeenCalled();
    });
});
