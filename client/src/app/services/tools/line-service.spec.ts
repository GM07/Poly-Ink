import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from './line-service';
import { MouseButton } from './pencil-service';

/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
/* tslint:disable:no-any */
describe('LigneService', () => {
    let service: LineService;
    const mockContext = {
        /* tslint:disable:no-empty */
        beginPath: () => {},
        moveTo: (x: number, y: number) => {},
        lineTo: (x: number, y: number) => {},
        stroke: () => {},
        closePath: () => {},
        /* tslint:enable:no-empty */
    } as CanvasRenderingContext2D;

    let pointsTest2: Vec2[];

    beforeEach(() => {
        const spyDrawing = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        /* tslint:disable-next-line:no-empty */
        spyDrawing.clearCanvas = () => {};
        spyDrawing['previewCtx'] = mockContext;
        spyDrawing['baseCtx'] = mockContext;
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: spyDrawing }],
        });
        service = TestBed.inject(LineService);
        service['pointToAdd'] = { x: 0, y: 0 };
        service['mousePosition'] = { x: 0, y: 0 };
        pointsTest2 = [
            { x: 100, y: 100 },
            { x: 200, y: 300 },
        ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add point on mouse position on first mouse left button down', () => {
        const mouseEvent = { button: MouseButton.Left, offsetX: 300, offsetY: 400 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service['points'].length).toBe(1);
        expect(service['points'][0]).toEqual({ x: 300, y: 400 } as Vec2);
    });

    it('should add point on mouse left button down', () => {
        service['points'] = [{ x: 100, y: 100 }];
        service['pointToAdd'] = { x: 120, y: 120 } as Vec2;
        const mouseEvent = { button: MouseButton.Left, offsetX: 500, offsetY: 283 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service['points'].length).toBe(2);
        expect(service['points'][1]).toEqual({ x: 120, y: 120 } as Vec2);
    });

    it('should add not add point on mouse right button down', () => {
        const mouseEvent = { button: MouseButton.Right, offsetX: 500, offsetY: 283 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service['points'].length).toBe(0);
    });

    it('should change value of mouseDown when mouse is up', () => {
        const mouseEvent = { button: MouseButton.Left } as MouseEvent;
        service['mouseDown'] = true;
        service.onMouseUp(mouseEvent);
        expect(service['mouseDown']).toBe(false);
    });

    it('should not reset if point array is empty on double click', () => {
        const clearCanvas = spyOn(service['drawingService'], 'clearCanvas').and.callThrough();

        service.onDoubleClick({ offsetX: 100, offsetY: 100 } as MouseEvent);
        expect(clearCanvas).not.toHaveBeenCalled();
    });

    it('should end drawing on double click without closing path', () => {
        const clearCanvas = spyOn(service['drawingService'], 'clearCanvas').and.callThrough();
        service['points'] = [{ x: 100, y: 800 } as Vec2];
        const lastEvent = { offsetX: 100, offsetY: 100 } as MouseEvent;
        const drawLinePath: any = spyOn<any>(service, 'drawLinePath').and.callThrough();

        service.onDoubleClick(lastEvent);
        expect(drawLinePath).toHaveBeenCalledWith(mockContext, [{ x: 100, y: 800 }], false);
        expect(clearCanvas).toHaveBeenCalled();
    });

    it('should end drawing on double click with a closed path', () => {
        const clearCanvas = spyOn(service['drawingService'], 'clearCanvas').and.callThrough();
        service['points'] = [{ x: 100, y: 819 } as Vec2];
        const lastEvent = { offsetX: 100, offsetY: 800 } as MouseEvent;
        const drawLinePath: any = spyOn<any>(service, 'drawLinePath').and.callThrough();

        service.onDoubleClick(lastEvent);
        expect(drawLinePath).toHaveBeenCalledWith(mockContext, [{ x: 100, y: 819 }], true);
        expect(clearCanvas).toHaveBeenCalled();
    });

    it('should not move line on mouse move when point array is empty', () => {
        const func = spyOn(service, 'getPositionFromMouse').and.callThrough();
        service.onMouseMove({} as MouseEvent);
        expect(func).not.toHaveBeenCalled();
    });

    it('should move line on mouse move when point array is not empty', () => {
        service['points'] = [{ x: 100, y: 200 } as Vec2];
        const alignPointFunc = spyOn(service, 'alignPoint').and.callThrough();

        service.onMouseMove({ offsetX: 120, offsetY: 540 } as MouseEvent);
        expect(alignPointFunc).not.toHaveBeenCalled();
        expect(service['pointToAdd']).toEqual({ x: 120, y: 540 } as Vec2);
    });

    it('should move and align line on mouse move when shift is pressed', () => {
        service['points'] = [{ x: 100, y: 200 } as Vec2];
        service['keyEvents'].set('Shift', true);
        const alignPointFunc = spyOn(service, 'alignPoint').and.returnValue({ x: 40, y: 60 });

        service.onMouseMove({ offsetX: 120, offsetY: 540 } as MouseEvent);
        expect(alignPointFunc).toHaveBeenCalled();
        expect(service['pointToAdd']).toEqual({ x: 40, y: 60 } as Vec2);
    });

    it('should not handle any key when point array is empty', () => {
        const handleBackspace = spyOn(service, 'handleBackspaceKey').and.callThrough();
        const handleEscape = spyOn(service, 'handleEscapeKey').and.callThrough();
        const handleShift = spyOn(service, 'handleShiftKey').and.callThrough();

        service.handleKeys('Backspace');
        expect(handleBackspace).not.toHaveBeenCalled();
        expect(handleEscape).not.toHaveBeenCalled();
        expect(handleShift).not.toHaveBeenCalled();
    });

    it('should set backspace key to pressed when pressing Backspace', () => {
        service['points'] = [{ x: 100, y: 300 }];
        const keyEvent: KeyboardEvent = { key: 'Backspace' } as KeyboardEvent;
        service.onKeyDown(keyEvent);
        expect(service['keyEvents'].get('Backspace')).toBe(true);
    });

    it('should not do anything when a random key is pressed', () => {
        const keyEvent: KeyboardEvent = { key: 'a' } as KeyboardEvent;
        service.onKeyDown(keyEvent);
        expect(service['keyEvents'].get('Backspace')).toBe(false);
        expect(service['keyEvents'].get('Shift')).toBe(false);
        expect(service['keyEvents'].get('Escape')).toBe(false);
    });

    it('should set shift key to released when releasing Shift', () => {
        const keyEvent: KeyboardEvent = { key: 'Shift' } as KeyboardEvent;
        service['keyEvents'].set('Shift', true);
        service.onKeyUp(keyEvent);
        expect(service['keyEvents'].get('Shift')).toBe(false);
    });

    it('should not do anything when a random key is released', () => {
        const keyEvent: KeyboardEvent = { key: 'Enter' } as KeyboardEvent;
        service['keyEvents'].set('Backspace', true);
        service['keyEvents'].set('Shift', true);
        service['keyEvents'].set('Escape', true);
        service.onKeyUp(keyEvent);
        expect(service['keyEvents'].get('Backspace')).toBe(true);
        expect(service['keyEvents'].get('Shift')).toBe(true);
        expect(service['keyEvents'].get('Escape')).toBe(true);
    });

    it('should call correct function when Backspace key is pressed', () => {
        service['points'].push({ x: 100, y: 100 } as Vec2);

        const handleBackspace = spyOn(service, 'handleBackspaceKey').and.callThrough();
        service.handleKeys('Backspace');
        expect(handleBackspace).toHaveBeenCalled();
    });

    it('should call correct function when Escape key is pressed', () => {
        service['points'].push({ x: 100, y: 100 } as Vec2);

        const handleEscape = spyOn(service, 'handleEscapeKey').and.callThrough();
        service.handleKeys('Escape');
        expect(handleEscape).toHaveBeenCalled();
    });

    it('should call correct function when Shift key is pressed', () => {
        service['points'].push({ x: 100, y: 100 } as Vec2);

        const handleShift = spyOn(service, 'handleShiftKey').and.callThrough();
        service.handleKeys('Shift');
        expect(handleShift).toHaveBeenCalled();
    });

    it('should not handle keys if point array is empty', () => {
        const handleBackspace = spyOn(service, 'handleBackspaceKey').and.callThrough();
        const handleEscape = spyOn(service, 'handleEscapeKey').and.callThrough();
        const handleShift = spyOn(service, 'handleShiftKey').and.callThrough();

        service.handleKeys('Shift');
        expect(handleBackspace).not.toHaveBeenCalled();
        expect(handleEscape).not.toHaveBeenCalled();
        expect(handleShift).not.toHaveBeenCalled();
    });

    it('should not do anything when Backspace key is released', () => {
        const handlePreviewFunc = spyOn(service, 'handleLinePreview').and.callThrough();
        service.handleBackspaceKey();
        expect(handlePreviewFunc).not.toHaveBeenCalled();
    });

    it('should delete point and update preview on a Backspace key event when there are 2 points', () => {
        service['points'] = pointsTest2;
        service['keyEvents'].set('Backspace', true);

        const handlePreviewFunc = spyOn(service, 'handleLinePreview').and.callThrough();

        service.handleBackspaceKey();
        expect(handlePreviewFunc).toHaveBeenCalled();
        expect(service['points'].length).toBe(1);
    });

    it('should not update preview on a Backspace key event when there is 1 point', () => {
        service['points'] = [{ x: 100, y: 100 }];
        service['keyEvents'].set('Backspace', true);

        const handlePreviewFunc = spyOn(service, 'handleLinePreview').and.callThrough();

        service.handleBackspaceKey();
        expect(handlePreviewFunc).not.toHaveBeenCalled();
        expect(service['points'].length).toBe(0);
    });

    it('should not do anything on a Backspace key event when points array is empty', () => {
        service['keyEvents'].set('Backspace', true);
        const handlePreviewFunc = spyOn(service, 'handleLinePreview').and.callThrough();
        service.handleBackspaceKey();
        expect(handlePreviewFunc).not.toHaveBeenCalled();
    });

    it('should align points when shift key is pressed', () => {
        service['keyEvents'].set('Shift', true);
        service['points'].push({ x: 10, y: 10 });
        const alignFunc = spyOn(service, 'alignPoint').and.returnValue({ x: 100, y: 100 } as Vec2);

        service.handleShiftKey();
        expect(alignFunc).toHaveBeenCalled();
        expect(service['pointToAdd']).toEqual({ x: 100, y: 100 } as Vec2);
    });

    it('should point to mouse position when shift key is released', () => {
        // tslint:disable-next-line:no-empty
        service['points'].push({ x: 10, y: 10 });
        service['keyEvents'].set('Shift', false);
        service.handleShiftKey();
        expect(service['pointToAdd']).toEqual({ x: 0, y: 0 } as Vec2);
    });

    it('should clear points when escape key is pressed', () => {
        service['points'] = pointsTest2;
        service['keyEvents'].set('Escape', true);
        service.handleEscapeKey();
        expect(service['points'].length).toBe(0);
    });

    it('should not do anything when escape key is released', () => {
        service['points'] = pointsTest2;
        service.handleEscapeKey();
        expect(service['points'].length).toBe(2);
    });

    it('should stop drawing', () => {
        const spyFunc = spyOn(service['drawingService'], 'clearCanvas');
        service.stopDrawing();
        expect(spyFunc).toHaveBeenCalled();
    });

    it('should handle line preview', () => {
        service['points'] = [{ x: 100, y: 100 }];
        service['pointToAdd'] = { x: 200, y: 200 };
        service['drawingService'].previewCtx = mockContext;
        const clearCanvasSpy = spyOn(service['drawingService'], 'clearCanvas').and.callThrough();
        service.handleLinePreview();
        expect(clearCanvasSpy).toHaveBeenCalled();
    });

    it('should draw line', () => {
        const moveToSpy = spyOn(mockContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(mockContext, 'lineTo').and.callThrough();

        service['drawLine'](mockContext, { x: 100, y: 200 }, { x: 300, y: 400 });
        expect(moveToSpy).toHaveBeenCalledWith(100, 200);
        expect(lineToSpy).toHaveBeenCalledWith(300, 400);
    });

    it('should draw non closed line path', () => {
        const points = pointsTest2;
        service['points'] = points;

        const moveToSpy = spyOn(mockContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(mockContext, 'lineTo').and.callThrough();

        service['drawLinePath'](mockContext, points, false);
        expect(moveToSpy).toHaveBeenCalledTimes(1);
        expect(lineToSpy).toHaveBeenCalledTimes(1);
    });

    it('should draw closed line path', () => {
        pointsTest2.push({ x: 453, y: 764 });
        const points = pointsTest2;
        service['points'] = points;

        const moveToSpy = spyOn(mockContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(mockContext, 'lineTo').and.callThrough();

        service['drawLinePath'](mockContext, points, true);
        expect(moveToSpy).toHaveBeenCalledTimes(1);
        expect(lineToSpy).toHaveBeenCalledTimes(3);
    });

    it('should not draw line path', () => {
        const points = [{ x: 100, y: 100 }];
        service['points'] = points;

        const moveToSpy = spyOn(mockContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(mockContext, 'lineTo').and.callThrough();

        service['drawLinePath'](mockContext, points, true);
        expect(moveToSpy).not.toHaveBeenCalled();
        expect(lineToSpy).not.toHaveBeenCalled();
    });

    it('should align points', () => {
        service['points'] = [
            { x: 500, y: 500 },
            { x: 200, y: 300 },
        ];
        const result: Vec2 = service.alignPoint({ x: 210, y: 200 });
        expect(result).toEqual({ x: 200, y: 200 });
    });

    it('should return last point', () => {
        service['points'] = pointsTest2;
        expect(service['getLastPoint']()).toEqual(pointsTest2[pointsTest2.length - 1]);
    });
});
