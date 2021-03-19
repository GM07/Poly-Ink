import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { LineService } from './line.service';

/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
/* tslint:disable:no-any */
/* tslint:disable:no-empty */

describe('LineService', () => {
    let service: LineService;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let spyDrawing: jasmine.SpyObj<DrawingService>;

    let canvasTestHelper: CanvasTestHelper;
    let pointsTest2: Vec2[];
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        spyDrawing = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'drawPreview', 'draw']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', [], { primaryRgba: 'rgba(1, 1, 1, 1)', secondaryRgba: 'rgba(0, 0, 0, 1)' });
        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: spyDrawing },
                { provide: ColorService, useValue: colorServiceSpy },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service = TestBed.inject(LineService);

        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;
        service['pointToAdd'] = { x: 0, y: 0 };
        service['mousePosition'] = { x: 0, y: 0 };
        service.config.showJunctionPoints = false;
        pointsTest2 = [
            { x: 100, y: 100 },
            { x: 200, y: 300 },
        ];
        spyOn(service, 'isInCanvas').and.returnValue(true);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add point on mouse position on first mouse left button down', async () => {
        const mouseEvent = { button: MouseButton.Left, clientX: 300, clientY: 400, detail: 1 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service.config.points.length).toBe(1);
        expect(service.config.points[0]).toEqual({ x: 300, y: 400 } as Vec2);
    });

    it('should add point on mouse left button down', async () => {
        service.config.points = [{ x: 100, y: 100 }];
        service['pointToAdd'] = { x: 120, y: 120 } as Vec2;
        service.config.showJunctionPoints = true;
        const mouseEvent = { button: MouseButton.Left, x: 500, y: 283, detail: 1 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service.config.points.length).toBe(2);
        expect(service.config.points[1]).toEqual({ x: 120, y: 120 } as Vec2);
    });

    it('should not add point on mouse right button down', () => {
        const mouseEvent = { button: MouseButton.Right, clientX: 500, clientY: 283, detail: 1 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service.config.points.length).toBe(0);
    });

    it('should change value of mouseDown when mouse left button is up', () => {
        service['leftMouseDown'] = true;
        let mouseEvent: MouseEvent = { button: MouseButton.Right } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(service['leftMouseDown']).toBe(true);
        mouseEvent = { button: MouseButton.Left } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(service['leftMouseDown']).toBe(false);
    });

    it('should do nothing when awaiting a double click', () => {
        const handlePreviewFunc = spyOn<any>(service, 'handleLinePreview');
        const handleKeys = spyOn<any>(service, 'handleKeys');
        service.onMouseMove({} as MouseEvent);
        expect(handlePreviewFunc).not.toHaveBeenCalled();
        service.onKeyDown({} as KeyboardEvent);
        expect(handleKeys).not.toHaveBeenCalled();
        service.onKeyUp({} as KeyboardEvent);
        expect(handleKeys).not.toHaveBeenCalled();
    });

    it('should not do anything on triple click', () => {
        service.config.points = [{ x: 100, y: 800 } as Vec2];
        const lastEvent = { x: 100, y: 100, detail: 3 } as MouseEvent;
        const simpleFunc = spyOn<any>(service, 'handleSimpleClick');
        const doubleFunc = spyOn<any>(service, 'handleDoubleClick');

        service.onMouseDown(lastEvent);
        expect(simpleFunc).not.toHaveBeenCalled();
        expect(doubleFunc).not.toHaveBeenCalled();
    });

    it('should end drawing on double click without closing path', () => {
        const points = [{ x: 100, y: 800 } as Vec2];
        service.config.points = points;
        service['SHIFT'].isDown = true;
        const lastEvent = { x: 100, y: 100, detail: 2 } as MouseEvent;
        spyOn(service, 'draw').and.stub();
        service.onMouseDown(lastEvent);
        expect(service.draw).toHaveBeenCalled();
        expect(service.config.closedLoop).toBeFalsy();
    });

    it('should end drawing on double click with a closed path', async () => {
        service.config.points = [{ x: 500, y: 400 }, { x: 200, y: 300 }, { x: 100, y: 819 } as Vec2];
        const lastEvent = { clientX: 500, clientY: 419, detail: 2 } as MouseEvent;
        spyOn(service, 'draw').and.stub();
        spyOn(service, 'initService').and.stub();
        service.onMouseDown(lastEvent);
        expect(service.draw).toHaveBeenCalled();
        expect(service.config.closedLoop).toBeTruthy();
    });

    it('should move line on mouse move when point array is not empty', () => {
        const getPositionFromMouse = spyOn<any>(service, 'getPositionFromMouse').and.callThrough();
        service.onMouseMove({} as MouseEvent);
        expect(getPositionFromMouse).not.toHaveBeenCalled();
        service.config.points = [{ x: 100, y: 200 } as Vec2];
        const alignPointFunc = spyOn<any>(service, 'alignPoint').and.callThrough();
        service.onMouseMove({ clientX: 120, clientY: 540 } as MouseEvent);
        expect(alignPointFunc).not.toHaveBeenCalled();
        expect(service['pointToAdd']).toEqual({ x: 120, y: 540 } as Vec2);
    });

    it('should move and align line on mouse move when shift is pressed', () => {
        service.config.points = [{ x: 100, y: 200 } as Vec2];
        service['SHIFT'].isDown = true;
        const alignPointFunc = spyOn<any>(service, 'alignPoint').and.returnValue({ x: 40, y: 60 });
        service.onMouseMove({ clientX: 120, clientY: 540 } as MouseEvent);
        expect(alignPointFunc).toHaveBeenCalled();
        expect(service['pointToAdd']).toEqual({ x: 40, y: 60 } as Vec2);
    });

    it('should not handle any key when point array is empty', () => {
        const handleBackspace = spyOn<any>(service, 'handleBackspaceKey');
        service['handleKeys'](service['BACKSPACE']);
        expect(handleBackspace).not.toHaveBeenCalled();
    });

    it('should set backspace key to pressed when pressing Backspace', () => {
        service.config.points = [{ x: 100, y: 300 }];
        const keyEvent: KeyboardEvent = { key: 'Backspace' } as KeyboardEvent;
        service.onKeyDown(keyEvent);
        expect(service['BACKSPACE'].isDown).toBe(true);
    });

    it('should not trigger event when key pressed is same as last', () => {
        service.config.points = [{ x: 100, y: 300 }];
        service['BACKSPACE'].isDown = true;
        const keyEvent: KeyboardEvent = { key: 'Backspace' } as KeyboardEvent;
        service.onKeyDown(keyEvent);
        spyOn<any>(service, 'handleKeys');
        expect(service['handleKeys']).not.toHaveBeenCalled();
    });

    it('should not do anything when a random key is pressed', () => {
        const keyEvent: KeyboardEvent = { key: 'randomKey', shiftKey: false } as KeyboardEvent;
        service.onKeyDown(keyEvent);
        expect(service['BACKSPACE'].isDown).toBe(false);
    });

    it('should set shift key to released when releasing Shift', () => {
        const keyEvent: KeyboardEvent = { key: 'Shift' } as KeyboardEvent;
        service['SHIFT'].isDown = true;
        service.onKeyUp(keyEvent);
        expect(service['SHIFT'].isDown).toBe(false);
    });

    it('should not do anything when a random key is released', () => {
        const keyEvent: KeyboardEvent = { key: 'randomKey', shiftKey: true } as KeyboardEvent;
        service['ESCAPE'].isDown = true;
        service.onKeyUp(keyEvent);
        expect(service['ESCAPE'].isDown).toBe(true);
    });

    it('should call correct function when Backspace key is pressed', () => {
        service.config.points.push({ x: 100, y: 100 } as Vec2);
        const handleBackspace = spyOn<any>(service, 'handleBackspaceKey');
        service['handleKeys'](service['BACKSPACE']);
        expect(handleBackspace).toHaveBeenCalled();
    });

    it('should call correct function when Escape key is pressed', () => {
        service.config.points.push({ x: 100, y: 100 } as Vec2);
        const handleEscape = spyOn<any>(service, 'handleEscapeKey');
        service['handleKeys'](service['ESCAPE']);
        expect(handleEscape).toHaveBeenCalled();
    });

    it('should call correct function when Shift key is pressed', () => {
        service.config.points.push({ x: 100, y: 100 } as Vec2);
        const handleShift = spyOn<any>(service, 'handleShiftKey');
        service['handleKeys'](service['SHIFT']);
        expect(handleShift).toHaveBeenCalled();
    });

    it('should not do anything when Backspace key is released', () => {
        const handlePreviewFunc = spyOn<any>(service, 'handleLinePreview');
        service['handleBackspaceKey']();
        expect(handlePreviewFunc).not.toHaveBeenCalled();
    });

    it('should delete point and update preview on a Backspace key event when there are 2 points', () => {
        service.config.points = pointsTest2;
        service['BACKSPACE'].isDown = true;
        const handlePreviewFunc = spyOn<any>(service, 'handleLinePreview');
        service['handleBackspaceKey']();
        expect(handlePreviewFunc).toHaveBeenCalled();
        expect(service.config.points.length).toBe(1);
    });

    it('should not do anything on a Backspace key event when points array is empty ', () => {
        service['BACKSPACE'].isDown = true;
        const handlePreviewFunc = spyOn<any>(service, 'handleLinePreview');
        service['handleBackspaceKey']();
        expect(handlePreviewFunc).not.toHaveBeenCalled();
    });

    it('should not align points when shift key is pressed when mouse is down', () => {
        service['SHIFT'].isDown = true;
        service.config.points.push({ x: 10, y: 10 });
        service['leftMouseDown'] = true;
        const alignFunc = spyOn<any>(service, 'alignPoint').and.returnValue({ x: 100, y: 100 } as Vec2);
        service['handleShiftKey']();
        expect(alignFunc).not.toHaveBeenCalled();
    });

    it('should align points when shift key is pressed', () => {
        service['SHIFT'].isDown = true;
        service.config.points.push({ x: 10, y: 10 });
        const alignFunc = spyOn<any>(service, 'alignPoint').and.returnValue({ x: 100, y: 100 } as Vec2);
        service['handleShiftKey']();
        expect(alignFunc).toHaveBeenCalled();
        expect(service['pointToAdd']).toEqual({ x: 100, y: 100 } as Vec2);
    });

    it('should point to mouse position when shift key is released', () => {
        service.config.points.push({ x: 10, y: 10 });
        service['SHIFT'].isDown = false;
        service['handleShiftKey']();
        expect(service['pointToAdd']).toEqual({ x: 0, y: 0 } as Vec2);
    });

    it('should clear points when escape key is pressed', () => {
        service.config.points = pointsTest2;
        service['ESCAPE'].isDown = true;
        service['handleEscapeKey']();
        expect(service.config.points.length).toBe(0);
    });

    it('should stop drawing', () => {
        service.stopDrawing();
        expect(spyDrawing.clearCanvas).toHaveBeenCalled();
    });

    it('should handle line preview', () => {
        service.config.points = [{ x: 100, y: 100 }];
        service['pointToAdd'] = { x: 200, y: 200 };
        service['drawingService'].previewCtx = previewCtxStub;
        service['handleLinePreview']();
        expect(spyDrawing.clearCanvas).toHaveBeenCalled();
    });

    it('should align points', () => {
        service.config.points = [
            { x: 500, y: 500 },
            { x: 200, y: 300 },
        ];
        const result: Vec2 = service['alignPoint']({ x: 310, y: 405 });
        expect(result).toEqual({ x: 310, y: 410 });
    });

    it('should align points when vertical', () => {
        service.config.points = [
            { x: 500, y: 500 },
            { x: 200, y: 300 },
        ];
        const result: Vec2 = service['alignPoint']({ x: 205, y: 500 });
        expect(result).toEqual({ x: 200, y: 500 });
    });

    it('should send command to drawing service to draw on preview', () => {
        service.drawPreview();
        expect(spyDrawing.drawPreview).toHaveBeenCalled();
    });

    it('should send command to drawing service to draw on base', () => {
        service.draw();
        expect(spyDrawing.draw).toHaveBeenCalled();
    });

    it('Handle Escape Key should not clear the canvas on other key', () => {
        service['ESCAPE'].isDown = false;
        service['handleEscapeKey']();
        expect(service['drawingService'].clearCanvas).not.toHaveBeenCalled();
    });

    it('init service should init attributes', () => {
        service['initService']();
        expect(service['SHIFT'].isDown).toBe(false);
        expect(service['BACKSPACE'].isDown).toBe(false);
        expect(service.config.points.length).toBe(0);
    });
});
