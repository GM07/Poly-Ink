import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { LineService } from './line.service';

/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
/* tslint:disable:no-any */

describe('LineService', () => {
    let service: LineService;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;

    const mockContext = ({
        /* tslint:disable:no-empty */
        beginPath: () => {},
        moveTo: (x: number, y: number) => {},
        lineTo: (x: number, y: number) => {},
        stroke: () => {},
        arc: () => {},
        fill: () => {},
        closePath: () => {},
        /* tslint:enable:no-empty */
    } as unknown) as CanvasRenderingContext2D;

    let pointsTest2: Vec2[];

    const delay = async (ms: number) => new Promise((result) => setTimeout(result, ms));
    beforeEach(() => {
        const spyDrawing = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', [], { primaryRgba: 'rgba(1, 1, 1, 1)', secondaryRgba: 'rgba(0, 0, 0, 1)' });
        /* tslint:disable-next-line:no-empty */
        spyDrawing.clearCanvas = () => {};
        spyDrawing['previewCtx'] = mockContext;
        spyDrawing['baseCtx'] = mockContext;
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: spyDrawing },
                { provide: ColorService, useValue: colorServiceSpy },
            ],
        });
        service = TestBed.inject(LineService);
        service['pointToAdd'] = { x: 0, y: 0 };
        service['mousePosition'] = { x: 0, y: 0 };
        service.showJunctionPoints = false;
        pointsTest2 = [
            { x: 100, y: 100 },
            { x: 200, y: 300 },
        ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add point on mouse position on first mouse left button down', async () => {
        const mouseEvent = { button: MouseButton.Left, offsetX: 300, offsetY: 400, detail: 1 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        await delay(LineService.TIMEOUT_SIMPLE_CLICK * 2);
        expect(service['points'].length).toBe(1);
        expect(service['points'][0]).toEqual({ x: 300, y: 400 } as Vec2);
    });

    it('should add point on mouse left button down', async () => {
        service['points'] = [{ x: 100, y: 100 }];
        service['pointToAdd'] = { x: 120, y: 120 } as Vec2;
        service['showJunctionPoints'] = true;
        const mouseEvent = { button: MouseButton.Left, offsetX: 500, offsetY: 283, detail: 1 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        await delay(LineService.TIMEOUT_SIMPLE_CLICK * 2);
        expect(service['points'].length).toBe(2);
        expect(service['points'][1]).toEqual({ x: 120, y: 120 } as Vec2);
    });

    it('should not add point on mouse right button down', () => {
        service['timeoutID'] = 1;
        const mouseEvent = { button: MouseButton.Right, offsetX: 500, offsetY: 283, detail: 1 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service['points'].length).toBe(0);
    });

    it('should change value of mouseDown when mouse left button is up', () => {
        service['mouseDown'] = true;
        let mouseEvent: MouseEvent = { button: MouseButton.Right } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(service['mouseDown']).toBe(true);
        mouseEvent = { button: MouseButton.Left } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(service['mouseDown']).toBe(false);
    });

    it('should reset properly', () => {
        service['awaitsDoubleClick'] = true;
        service['timeoutID'] = 1;
        service.initService();
        expect(service['timeoutID']).toEqual(0);
        expect(service['awaitsDoubleClick']).toBeFalsy();
    });

    it('should do nothing when awaiting a double click', () => {
        service['awaitsDoubleClick'] = true;
        const handlePreviewFunc = spyOn(service, 'handleLinePreview').and.callThrough();
        const handleKeys = spyOn(service, 'handleKeys').and.callThrough();
        service.onMouseMove({} as MouseEvent);
        expect(handlePreviewFunc).not.toHaveBeenCalled();
        service.onKeyDown({} as KeyboardEvent);
        expect(handleKeys).not.toHaveBeenCalled();
        service.onKeyUp({} as KeyboardEvent);
        expect(handleKeys).not.toHaveBeenCalled();
    });

    it('should not do anything on triple click', () => {
        service['points'] = [{ x: 100, y: 800 } as Vec2];
        const lastEvent = { offsetX: 100, offsetY: 100, detail: 3 } as MouseEvent;
        const simpleFunc = spyOn(service, 'handleSimpleClick').and.callThrough();
        const doubleFunc = spyOn(service, 'handleDoubleClick').and.callThrough();

        service.onMouseDown(lastEvent);
        expect(simpleFunc).not.toHaveBeenCalled();
        expect(doubleFunc).not.toHaveBeenCalled();
    });

    it('should end drawing on double click without closing path', () => {
        service['points'] = [{ x: 100, y: 800 } as Vec2];
        service['keyEvents'].set('Shift', true);
        const lastEvent = { offsetX: 100, offsetY: 100, detail: 2 } as MouseEvent;
        const drawLinePath: any = spyOn<any>(service, 'drawLinePath').and.callThrough();
        service.onMouseDown(lastEvent);
        expect(drawLinePath).toHaveBeenCalledWith(mockContext, [{ x: 100, y: 800 }]);
    });

    it('should end drawing on double click with a closed path', async () => {
        service['points'] = [{ x: 500, y: 400 }, { x: 200, y: 300 }, { x: 100, y: 819 } as Vec2];
        const lastEvent = { offsetX: 500, offsetY: 419, detail: 2 } as MouseEvent;
        const drawLinePath: any = spyOn<any>(service, 'drawLinePath').and.callThrough();
        service.onMouseDown(lastEvent);
        expect(drawLinePath).toHaveBeenCalledWith(mockContext, [
            { x: 500, y: 400 },
            { x: 200, y: 300 },
            { x: 100, y: 819 },
            { x: 500, y: 400 },
        ]);
    });

    it('should move line on mouse move when point array is not empty', () => {
        const getPositionFromMouse = spyOn(service, 'getPositionFromMouse').and.callThrough();
        service.onMouseMove({} as MouseEvent);
        expect(getPositionFromMouse).not.toHaveBeenCalled();
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
        service.handleKeys('Backspace');
        expect(handleBackspace).not.toHaveBeenCalled();
    });

    it('should set backspace key to pressed when pressing Backspace', () => {
        service['points'] = [{ x: 100, y: 300 }];
        const keyEvent: KeyboardEvent = { key: 'Backspace' } as KeyboardEvent;
        service.onKeyDown(keyEvent);
        expect(service['keyEvents'].get('Backspace')).toBe(true);
    });

    it('should not do anything when a random key is pressed', () => {
        const keyEvent: KeyboardEvent = { key: 'randomKey', shiftKey: false } as KeyboardEvent;
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
        const keyEvent: KeyboardEvent = { key: 'randomKey', shiftKey: true } as KeyboardEvent;
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

    it('should not do anything on a Backspace key event when points array is empty ', () => {
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
        const lineToSpy = spyOn(mockContext, 'lineTo').and.callThrough();
        service['drawLinePath'](mockContext, points);
        expect(lineToSpy).toHaveBeenCalledTimes(1);
    });

    it('should draw junctions', () => {
        service['showJunctionPoints'] = true;
        const fillFunc = spyOn(mockContext, 'fill').and.callThrough();
        service['drawJunction'](mockContext, { x: 0, y: 0 });
        expect(fillFunc).toHaveBeenCalled();
    });

    it('should align points', () => {
        service['points'] = [
            { x: 500, y: 500 },
            { x: 200, y: 300 },
        ];
        const result: Vec2 = service.alignPoint({ x: 210, y: 200 });
        expect(result).toEqual({ x: 200, y: 200 });
    });
});
