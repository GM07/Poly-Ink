import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from './abstract-selection.service';

// tslint:disable:no-any
// tslint:disable:no-string-literal
describe('AbstractSelectionService', () => {
    let service: AbstractSelectionService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasSelection: HTMLCanvasElement;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    let mouseEvent: MouseEvent;

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

        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        mouseEvent = {
            x: 25,
            y: 25,
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('set ArrowKeyUp should update the keys when down', () => {
        const keyboardEventLeft = new KeyboardEvent('keydown', { key: 'arrowleft' });
        const keyboardEventRight = new KeyboardEvent('keydown', { key: 'arrowright' });
        const keyboardEventDown = new KeyboardEvent('keydown', { key: 'arrowdown' });
        const keyboardEventUp = new KeyboardEvent('keydown', { key: 'arrowup' });
        service['setArrowKeyDown'](keyboardEventLeft);
        service['setArrowKeyDown'](keyboardEventRight);
        service['setArrowKeyDown'](keyboardEventUp);
        service['setArrowKeyDown'](keyboardEventDown);
        expect(service['LEFT_ARROW'].isDown).toBeTruthy();
        expect(service['RIGHT_ARROW'].isDown).toBeTruthy();
        expect(service['DOWN_ARROW'].isDown).toBeTruthy();
        expect(service['UP_ARROW'].isDown).toBeTruthy();
    });

    it('set ArrowKeyUp should update the keys when not down', () => {
        const keyboardEventLeft = new KeyboardEvent('keydown', { key: 'randomKey' });
        service['setArrowKeyDown'](keyboardEventLeft);
        expect(service['LEFT_ARROW'].isDown).toBeFalsy();
        expect(service['RIGHT_ARROW'].isDown).toBeFalsy();
        expect(service['DOWN_ARROW'].isDown).toBeFalsy();
        expect(service['UP_ARROW'].isDown).toBeFalsy();
    });

    it('set arrowKeyDown should update the keys when up', () => {
        service['LEFT_ARROW'].isDown = true;
        service['RIGHT_ARROW'].isDown = true;
        service['DOWN_ARROW'].isDown = true;
        service['UP_ARROW'].isDown = true;
        const keyboardEventLeft = new KeyboardEvent('keyup', { key: 'arrowleft' });
        const keyboardEventRight = new KeyboardEvent('keyup', { key: 'arrowright' });
        const keyboardEventDown = new KeyboardEvent('keyup', { key: 'arrowdown' });
        const keyboardEventUp = new KeyboardEvent('keyup', { key: 'arrowup' });
        service['setArrowKeyUp'](keyboardEventLeft);
        service['setArrowKeyUp'](keyboardEventRight);
        service['setArrowKeyUp'](keyboardEventUp);
        service['setArrowKeyUp'](keyboardEventDown);
        expect(service['LEFT_ARROW'].isDown).toBeFalsy();
        expect(service['RIGHT_ARROW'].isDown).toBeFalsy();
        expect(service['DOWN_ARROW'].isDown).toBeFalsy();
        expect(service['UP_ARROW'].isDown).toBeFalsy();
    });

    it('set ArrowKeyDown should update the keys when not up', () => {
        const keyboardEventLeft = new KeyboardEvent('keydown', { key: 'randomKey' });
        service['setArrowKeyUp'](keyboardEventLeft);
        expect(service['LEFT_ARROW'].isDown).toBeFalsy();
        expect(service['RIGHT_ARROW'].isDown).toBeFalsy();
        expect(service['DOWN_ARROW'].isDown).toBeFalsy();
        expect(service['UP_ARROW'].isDown).toBeFalsy();
    });

    it('is in selection should return true if is in selection', () => {
        // tslint:disable:no-magic-numbers
        service['selectionCtx'] = canvasSelection.getContext('2d');
        service['selectionCoords'] = { x: 0, y: 0 } as Vec2;
        service['width'] = 50;
        service['height'] = 50;
        spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 25, y: 25 } as Vec2);
        spyOn<any>(service, 'isInSelection').and.callThrough();
        expect(service.isInSelection(mouseEvent)).toBeTruthy();
    });

    it('HorizontalTranslationModifier should return 1 if right Arrow is down', () => {
        service['RIGHT_ARROW'].isDown = true;
        expect(service['HorizontalTranslationModifier']()).toEqual(1);
    });

    it('HorizontalTranslationModifier should return -1 if left Arrow is down', () => {
        // tslint:disable:no-magic-numbers
        service['RIGHT_ARROW'].isDown = false;
        service['LEFT_ARROW'].isDown = true;
        expect(service['HorizontalTranslationModifier']()).toEqual(-1);
    });

    it('VerticalTranslationModifier should return 1 if down Arrow is down', () => {
        service['DOWN_ARROW'].isDown = true;
        expect(service['VerticalTranslationModifier']()).toEqual(1);
    });

    it('VerticalTranslationModifier should return -1 if up Arrow is down', () => {
        // tslint:disable:no-magic-numbers
        service['UP_ARROW'].isDown = true;
        expect(service['VerticalTranslationModifier']()).toEqual(-1);
    });

    it('get translation should return the current translation', () => {
        const mousePos = { x: 25, y: 25 } as Vec2;
        service['translationOrigin'] = { x: 25, y: 25 } as Vec2;
        expect(service['getTranslation'](mousePos)).toEqual({ x: 0, y: 0 } as Vec2);
    });

    it('on mouse down should do nothing with different click', () => {
        spyOn(service, 'getPositionFromMouse');
        const badMouseEvent = { button: 1 } as MouseEvent;
        service.onMouseDown(badMouseEvent);
        expect(service.getPositionFromMouse).not.toHaveBeenCalled();
    });

    it('should change update selection on mouseMove', () => {
        service.leftMouseDown = true;
        service.selectionCtx = canvasSelection.getContext('2d');
        const updateSpy = spyOn<any>(service, 'updateSelection');
        spyOn(service, 'getTranslation').and.returnValue({ x: 1, y: 1 } as Vec2);
        service.onMouseMove(mouseEvent);
        expect(updateSpy).toHaveBeenCalled();
    });

    it('should update the mouseUp coords when outside the canvas', () => {
        spyOn<any>(service, 'isInCanvas').and.returnValue(false);
        // tslint:disable:no-magic-numbers
        const getPositionSpy = spyOn<any>(service, 'getPositionFromMouse').and.returnValue({ x: 1000, y: 1000 } as Vec2);
        service.leftMouseDown = true;
        service.selectionCtx = null;
        service['setMouseUpCoord'](mouseEvent);
        expect(service.mouseUpCoord).toEqual({ x: canvasTestHelper.canvas.width, y: canvasTestHelper.canvas.height } as Vec2);
        getPositionSpy.and.returnValue({ x: -1, y: -1 } as Vec2);
        service['setMouseUpCoord']({ x: -1, y: -1 } as MouseEvent);
        expect(service.mouseUpCoord).toEqual({ x: 0, y: 0 } as Vec2);
    });

    it('should update the mouseUp coords when inside the canvas', () => {
        spyOn<any>(service, 'isInCanvas').and.returnValue(true);
        const getPosition = spyOn<any>(service, 'getPositionFromMouse');
        service['setMouseUpCoord'](mouseEvent);
        expect(getPosition).toHaveBeenCalled();
    });

    it('should do nothing on mouseUp if mouse is not down', () => {
        spyOn<any>(service, 'isInCanvas');
        service.onMouseUp(mouseEvent);
        expect(service['isInCanvas']).not.toHaveBeenCalled();
    });

    it('on mouse move should do nothing if mouse is not down', () => {
        spyOn(service, 'getPositionFromMouse');
        service.onMouseMove(mouseEvent);
        expect(service.getPositionFromMouse).not.toHaveBeenCalled();
    });

    it('Makes sure the selection updates in the canvas when the mouse moves outside of the canvas', () => {
        const updateSpy = spyOn<any>(service, 'updateSelection');
        spyOn<any>(service, 'setMouseUpCoord');
        service['selectionCtx'] = canvasSelection.getContext('2d');
        service.mouseUpCoord = { x: 10, y: 10 } as Vec2;
        service.leftMouseDown = true;
        mouseEvent = { x: 1000, y: 1000 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(updateSpy).toHaveBeenCalled();
    });

    it('pressing shift should do nothing if selection is not null', () => {
        service['leftMouseDown'] = true;
        const keyboardEventDown = new KeyboardEvent('keydown', { shiftKey: true });
        const keyboardEventUp = new KeyboardEvent('keydown', { shiftKey: false });
        spyOn<any>(service, 'updateDrawingSelection');
        service['selectionCtx'] = canvasSelection.getContext('2d');
        service.onKeyDown(keyboardEventDown);
        service.onKeyUp(keyboardEventUp);
        expect(service['updateDrawingSelection']).not.toHaveBeenCalled();
    });

    it('key down should do nothing on invalid key', () => {
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'invalid' });
        spyOn(service, 'stopDrawing');
        spyOn(service, 'selectAll');
        spyOn<any>(service, 'updateDrawingSelection');
        service.onKeyDown(keyboardEvent);
        expect(service.stopDrawing).not.toHaveBeenCalled();
        expect(service.selectAll).not.toHaveBeenCalled();
        expect(service['updateDrawingSelection']).not.toHaveBeenCalled();
    });

    it('selection should not move with different keys than arrow', () => {
        spyOn<any>(service, 'updateSelection');
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'invalid' });
        service['selectionCtx'] = canvasSelection.getContext('2d');
        service.onKeyDown(keyboardEvent);
        expect(service['updateSelection']).not.toHaveBeenCalled();
    });

    it('should do nothing on event repeat', () => {
        const keyboardEvent = new KeyboardEvent('keydown', { key: 'arrowleft', repeat: true });
        service['selectionCtx'] = canvasSelection.getContext('2d');
        spyOn<any>(service, 'updateSelection');
        service.onKeyDown(keyboardEvent);
        expect(service['updateSelection']).not.toHaveBeenCalled();
    });

    it('should not stop moving the selection if we release a different key than an arrow', () => {
        service['LEFT_ARROW'].isDown = true;
        const keyboardEventUp = new KeyboardEvent('keydown', { shiftKey: false });
        service['selectionCtx'] = canvasSelection.getContext('2d');
        spyOn(window, 'clearInterval');
        service.onKeyUp(keyboardEventUp);
        expect(window.clearInterval).not.toHaveBeenCalled();
    });

    it('isInSelection should do nothing if there is no selection', () => {
        spyOn(service, 'getPositionFromMouse');
        service.isInSelection(mouseEvent);
        expect(service.getPositionFromMouse).not.toHaveBeenCalled();
    });

    it('should clear the translation interval for the arrow keys', () => {
        service['clearArrowKeys']();
        expect(service['moveId']).toEqual(service['DEFAULT_MOVE_ID']);
    });
});
