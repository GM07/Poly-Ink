import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from './abstract-selection.service';

describe('AbstractSelectionService', () => {
    let service: AbstractSelectionService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasSelection: HTMLCanvasElement;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let mouseEvent = {
        offsetX: 25,
        offsetY: 25,
        button: 0,
    } as MouseEvent;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });
        service = TestBed.inject(AbstractSelectionService);
        canvasSelection = document.createElement('canvas');

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('set ArrowKeyUp should update the keys when down', () => {
        let keyboardEventLeft = new KeyboardEvent('keydown', { key: 'arrowleft' });
        let keyboardEventRight = new KeyboardEvent('keydown', { key: 'arrowright' });
        let keyboardEventDown = new KeyboardEvent('keydown', { key: 'arrowdown' });
        let keyboardEventUp = new KeyboardEvent('keydown', { key: 'arrowup' });
        (service as any).setArrowKeyDown(keyboardEventLeft);
        (service as any).setArrowKeyDown(keyboardEventRight);
        (service as any).setArrowKeyDown(keyboardEventUp);
        (service as any).setArrowKeyDown(keyboardEventDown);
        expect((service as any).isLeftArrowDown).toBe(true);
        expect((service as any).isRightArrowDown).toBe(true);
        expect((service as any).isDownArrowDown).toBe(true);
        expect((service as any).isUpArrowDown).toBe(true);
    });

    it('set ArrowKeyUp should update the keys when not down', () => {
        let keyboardEventLeft = new KeyboardEvent('keydown', { key: 'randomKey' });
        (service as any).setArrowKeyDown(keyboardEventLeft);
        expect((service as any).isLeftArrowDown).toBe(false);
        expect((service as any).isRightArrowDown).toBe(false);
        expect((service as any).isDownArrowDown).toBe(false);
        expect((service as any).isUpArrowDown).toBe(false);
    });

    it('set arrowKeyDown should update the keys when up', () => {
        (service as any).isLeftArrowDown = true;
        (service as any).isRightArrowDown = true;
        (service as any).isUpArrowDown = true;
        (service as any).isDownArrowDown = true;
        let keyboardEventLeft = new KeyboardEvent('keyup', { key: 'arrowleft' });
        let keyboardEventRight = new KeyboardEvent('keyup', { key: 'arrowright' });
        let keyboardEventDown = new KeyboardEvent('keyup', { key: 'arrowdown' });
        let keyboardEventUp = new KeyboardEvent('keyup', { key: 'arrowup' });
        (service as any).setArrowKeyUp(keyboardEventLeft);
        (service as any).setArrowKeyUp(keyboardEventRight);
        (service as any).setArrowKeyUp(keyboardEventUp);
        (service as any).setArrowKeyUp(keyboardEventDown);
        expect((service as any).isLeftArrowDown).toBe(false);
        expect((service as any).isRightArrowDown).toBe(false);
        expect((service as any).isDownArrowDown).toBe(false);
        expect((service as any).isUpArrowDown).toBe(false);
    });

    it('set ArrowKeyDown should update the keys when not up', () => {
        let keyboardEventLeft = new KeyboardEvent('keydown', { key: 'randomKey' });
        (service as any).setArrowKeyUp(keyboardEventLeft);
        expect((service as any).isLeftArrowDown).toBe(false);
        expect((service as any).isRightArrowDown).toBe(false);
        expect((service as any).isDownArrowDown).toBe(false);
        expect((service as any).isUpArrowDown).toBe(false);
    });

    it('is in selection should return true if is in selection', () => {
        (service as any).selectionCtx = canvasSelection.getContext('2d');
        (service as any).selectionCoords = { x: 0, y: 0 } as Vec2;
        (service as any).width = 50;
        (service as any).height = 50;
        spyOn(service as any, 'getPositionFromMouse').and.returnValue({ x: 25, y: 25 } as Vec2);
        spyOn(service as any, 'isInSelection').and.callThrough();
        expect(service.isInSelection(mouseEvent)).toEqual(true);
    });

    it('getXArrow should return 1 if right Arrow is down', () => {
        (service as any).isRightArrowDown = true;
        expect((service as any).getXArrow()).toEqual(1);
    });

    it('getXArrow should return -1 if left Arrow is down', () => {
        (service as any).isLeftArrowDown = true;
        expect((service as any).getXArrow()).toEqual(-1);
    });

    it('getYArrow should return 1 if down Arrow is down', () => {
        (service as any).isDownArrowDown = true;
        expect((service as any).getYArrow()).toEqual(1);
    });

    it('getYArrow should return -1 if up Arrow is down', () => {
        (service as any).isUpArrowDown = true;
        expect((service as any).getYArrow()).toEqual(-1);
    });

    it('get translation should return the current translation', () => {
        let mousePos = { x: 25, y: 25 } as Vec2;
        (service as any).translationOrigin = { x: 25, y: 25 } as Vec2;
        expect((service as any).getTranslation(mousePos)).toEqual({ x: 0, y: 0 } as Vec2);
    });

    it('on mouse down should do nothing with different click', () => {
        spyOn(service, 'getPositionFromMouse');
        const badMouseEvent = { button: 1 } as MouseEvent;
        service.onMouseDown(badMouseEvent);
        expect(service.getPositionFromMouse).not.toHaveBeenCalled();
    });

    it('should change translationOrigin when mouseDown and inSelection', () => {
        spyOn(service, 'isInSelection').and.returnValue(true);
        let saveTranslation: Vec2 = (service as any).translationOrigin;
        service.onMouseDown(mouseEvent);
        expect((service as any).translationOrigin).not.toEqual(saveTranslation);
    });

    it('should change update selection on mouseMove', () => {
        service.mouseDown = true;
        service.selectionCtx = canvasSelection.getContext('2d');
        const updateSpy = spyOn<any>(service, 'updateSelection');
        spyOn(service, 'getTranslation').and.returnValue({ x: 1, y: 1 } as Vec2);
        service.onMouseMove(mouseEvent);
        expect(updateSpy).toHaveBeenCalled();
    });

    it('should do nothing on mouseUp if mouse is not down', () => {
        spyOn(service as any, 'isInCanvas');
        service.onMouseUp(mouseEvent);
        expect((service as any).isInCanvas).not.toHaveBeenCalled();
    });

    it('on mouse move should do nothing if mouse is not down', () => {
        spyOn(service, 'getPositionFromMouse');
        service.onMouseMove(mouseEvent);
        expect(service.getPositionFromMouse).not.toHaveBeenCalled();
    });

    it('Makes sure the selection stays in the canvas when the mouse leaves', () => {
        const updateSpy = spyOn<any>(service, 'updateDrawingSelection');
        service.mouseUpCoord = { x: 10, y: 10 } as Vec2;
        service.mouseDown = false;
        service.onMouseLeave(mouseEvent);
        expect(updateSpy).not.toHaveBeenCalled();

        service.mouseDown = true;
        mouseEvent = { x: -1, y: -1 } as MouseEvent;
        service.onMouseLeave(mouseEvent);
        expect(service.mouseUpCoord).toEqual({ x: 0, y: 0 } as Vec2);
        expect(updateSpy).toHaveBeenCalled();

        const farX = canvasTestHelper.canvas.getBoundingClientRect().right + 1;
        const farY = canvasTestHelper.canvas.getBoundingClientRect().bottom + 1;
        mouseEvent = { x: farX, y: farY } as MouseEvent;
        service.onMouseLeave(mouseEvent);
        expect(service.mouseUpCoord).toEqual({ x: canvasTestHelper.canvas.width, y: canvasTestHelper.canvas.height } as Vec2);
    });

    it('pressing shift should do nothing if selection is not null', () => {
        (service as any).mouseDown = true;
        let keyboardEventDown = new KeyboardEvent('keydown', { shiftKey: true });
        let keyboardEventUp = new KeyboardEvent('keydown', { shiftKey: false });
        spyOn(service as any, 'updateDrawingSelection');
        (service as any).selectionCtx = canvasSelection.getContext('2d');
        service.onKeyDown(keyboardEventDown);
        service.onKeyUp(keyboardEventUp);
        expect((service as any).updateDrawingSelection).not.toHaveBeenCalled();
    });

    it('key down should do nothing on invalid key', () => {
        let keyboardEvent = new KeyboardEvent('keydown', { key: 'invalid' });
        spyOn(service, 'stopDrawing');
        spyOn(service, 'selectAll');
        spyOn(service as any, 'updateDrawingSelection');
        service.onKeyDown(keyboardEvent);
        expect(service.stopDrawing).not.toHaveBeenCalled();
        expect(service.selectAll).not.toHaveBeenCalled();
        expect((service as any).updateDrawingSelection).not.toHaveBeenCalled();
    });

    it('selection should not move with different keys than arrow', () => {
        spyOn(service as any, 'updateSelection');
        let keyboardEvent = new KeyboardEvent('keydown', { key: 'invalid' });
        (service as any).selectionCtx = canvasSelection.getContext('2d');
        service.onKeyDown(keyboardEvent);
        expect((service as any).updateSelection).not.toHaveBeenCalled();
    });

    it('should do nothing on event repeat', () => {
        let keyboardEvent = new KeyboardEvent('keydown', { key: 'arrowleft', repeat: true });
        (service as any).selectionCtx = canvasSelection.getContext('2d');
        spyOn(service as any, 'updateSelection');
        service.onKeyDown(keyboardEvent);
        expect((service as any).updateSelection).not.toHaveBeenCalled();
    });

    it('should not stop moving the selection if we release a different key than an arrow', () => {
        (service as any).isLeftArrowDown = true;
        let keyboardEventUp = new KeyboardEvent('keydown', { shiftKey: false });
        (service as any).selectionCtx = canvasSelection.getContext('2d');
        spyOn(window, 'clearInterval');
        service.onKeyUp(keyboardEventUp);
        expect(window.clearInterval).not.toHaveBeenCalled();
    });

    it('isInSelection should do nothing if there is no selection', () => {
        spyOn(service, 'getPositionFromMouse');
        service.isInSelection(mouseEvent);
        expect(service.getPositionFromMouse).not.toHaveBeenCalled();
    });
});
