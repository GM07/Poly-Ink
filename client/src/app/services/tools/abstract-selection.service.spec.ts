import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';
import { GridService } from '../drawing/grid.service';
import { MagnetismService } from '../drawing/magnetism.service';
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
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'draw', 'drawPreview', 'blockUndoRedo'], {
            changes: new Subject<void>(),
        });
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

    it('on mouse down should do nothing with different click', () => {
        spyOn(service, 'getPositionFromMouse');
        const badMouseEvent = { button: 1 } as MouseEvent;
        service.onMouseDown(badMouseEvent);
        expect(service.getPositionFromMouse).not.toHaveBeenCalled();
    });

    it('should transfer the selection movement on mouseMove', () => {
        service.leftMouseDown = true;
        service['config'].selectionCtx = canvasSelection.getContext('2d');
        const mouseMoveSpy = spyOn(service['selectionTranslation'], 'onMouseMove');
        service.onMouseMove(mouseEvent);
        expect(mouseMoveSpy).toHaveBeenCalled();
    });

    it('should update the mouseUp coords when outside the canvas', () => {
        spyOn<any>(service, 'isInCanvas').and.returnValue(false);
        // tslint:disable:no-magic-numbers
        const getPositionSpy = spyOn<any>(service, 'getPositionFromMouse').and.returnValue(new Vec2(1000, 1000));
        service.leftMouseDown = true;
        service['config'].selectionCtx = null;
        service['setMouseUpCoord'](mouseEvent);
        expect(service.mouseUpCoord).toEqual(new Vec2(canvasTestHelper.canvas.width, canvasTestHelper.canvas.height));
        getPositionSpy.and.returnValue(new Vec2(-1, -1));
        service['setMouseUpCoord']({ x: -1, y: -1 } as MouseEvent);
        expect(service.mouseUpCoord).toEqual(new Vec2(0, 0));
    });

    it('should update the mouseUp coords when inside the canvas', () => {
        spyOn<any>(service, 'isInCanvas').and.returnValue(true);
        const getPosition = spyOn<any>(service, 'getPositionFromMouse');
        service['setMouseUpCoord'](mouseEvent);
        expect(getPosition).toHaveBeenCalled();
    });

    it('should do nothing on mouseUp if mouse is not down', () => {
        const setMouseUpCoordSpy = spyOn<any>(service, 'setMouseUpCoord');
        service.onMouseUp(mouseEvent);
        expect(setMouseUpCoordSpy).not.toHaveBeenCalled();
    });

    it('on mouseUp should tranfer the events the selection translation', () => {
        service.leftMouseDown = true;
        service['config'].selectionCtx = canvasSelection.getContext('2d');
        const mouseUpSpy = spyOn(service['selectionTranslation'], 'onMouseUp');
        service.onMouseUp(mouseEvent);
        expect(mouseUpSpy).toHaveBeenCalled();
    });

    it('on mouse move should do nothing if mouse is not down', () => {
        spyOn(service, 'getPositionFromMouse');
        service.onMouseMove(mouseEvent);
        expect(service.getPositionFromMouse).not.toHaveBeenCalled();
    });

    it('Makes sure the selection updates in the canvas when the mouse moves outside of the canvas', () => {
        const updateSpy = spyOn<any>(service, 'updateSelection');
        spyOn<any>(service, 'setMouseUpCoord');
        service['config'].selectionCtx = canvasSelection.getContext('2d');
        service.mouseUpCoord = { x: 10, y: 10 } as Vec2;
        service.leftMouseDown = true;
        mouseEvent = { x: 1000, y: 1000 } as MouseEvent;
        service['selectionTranslation']['magnetismService'] = new MagnetismService(new GridService());
        service.onMouseMove(mouseEvent);
        expect(updateSpy).toHaveBeenCalled();
    });

    it('pressing shift should do nothing if selection is not null', () => {
        service.leftMouseDown = true;
        const keyboardEventDown = new KeyboardEvent('keydown', { shiftKey: true });
        const keyboardEventUp = new KeyboardEvent('keydown', { shiftKey: false });
        spyOn<any>(service, 'updateDrawingSelection');
        service['config'].selectionCtx = canvasSelection.getContext('2d');
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

    it('should start mouse translation', () => {
        const startMouseTranslationSpy = spyOn(service['selectionTranslation'], 'startMouseTranslation');
        service.startMouseTranslation({ button: 2 } as MouseEvent);
        expect(startMouseTranslationSpy).not.toHaveBeenCalled();
        service.startMouseTranslation(mouseEvent);
        expect(startMouseTranslationSpy).toHaveBeenCalled();
    });

    it('should initialise subscriptions', () => {
        const drawingServiceSubscribe = spyOn(service['drawingService'].changes, 'subscribe');
        const selectionTranslationSubscribe = spyOn(service['selectionTranslation'].updateSelectionRequest, 'subscribe');
        service['initSubscriptions']();
        expect(drawingServiceSubscribe).toHaveBeenCalled();
        expect(selectionTranslationSubscribe).toHaveBeenCalled();
    });
});
