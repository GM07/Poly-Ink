import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
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
        spyDrawing = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'drawPreview', 'draw', 'unblockUndoRedo']);
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
        service.lineDrawer['pointToAdd'] = new Vec2(0, 0);
        service.lineDrawer['mousePosition'] = new Vec2(0, 0);
        service.config.showJunctionPoints = false;
        pointsTest2 = [new Vec2(100, 100), new Vec2(200, 300)];
        spyOn(service, 'isInCanvas').and.returnValue(true);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add point on mouse position on first mouse left button down', async () => {
        const mouseEvent = { button: MouseButton.Left, clientX: 300, clientY: 400, detail: 1 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service.config.points.length).toBe(1);
        expect(service.config.points[0]).toEqual(new Vec2(300, 400));
    });

    it('should add point on mouse left button down', async () => {
        service.config.points = [new Vec2(100, 100)];
        service.lineDrawer['pointToAdd'] = new Vec2(120, 120);
        service.config.showJunctionPoints = true;
        const mouseEvent = { button: MouseButton.Left, x: 500, y: 283, detail: 1 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service.config.points.length).toBe(2);
        expect(service.config.points[1]).toEqual(new Vec2(120, 120));
    });

    it('should not add point on mouse right button down', () => {
        const mouseEvent = { button: MouseButton.Right, clientX: 500, clientY: 283, detail: 1 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service.config.points.length).toBe(0);
    });

    it('should change value of mouseDown when mouse left button is up', () => {
        service.lineDrawer['leftMouseDown'] = true;
        let mouseEvent: MouseEvent = { button: MouseButton.Right } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(service.lineDrawer['leftMouseDown']).toBe(true);
        mouseEvent = { button: MouseButton.Left } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(service.lineDrawer['leftMouseDown']).toBe(false);
    });

    it('should do nothing when awaiting a double click', () => {
        const handlePreviewFunc = spyOn<any>(service.lineDrawer, 'renderLinePreview');
        const handleKeys = spyOn<any>(service.lineDrawer, 'handleKeys');
        service.onMouseMove({} as MouseEvent);
        expect(handlePreviewFunc).not.toHaveBeenCalled();
        service.onKeyDown({} as KeyboardEvent);
        expect(handleKeys).not.toHaveBeenCalled();
        service.onKeyUp({} as KeyboardEvent);
        expect(handleKeys).not.toHaveBeenCalled();
    });

    it('should not do anything on triple click', () => {
        service.config.points = [new Vec2(100, 800)];
        const lastEvent = { x: 100, y: 100, detail: 3 } as MouseEvent;
        const simpleFunc = spyOn<any>(service, 'handleSimpleClick');
        const doubleFunc = spyOn<any>(service, 'handleDoubleClick');

        service.onMouseDown(lastEvent);
        expect(simpleFunc).not.toHaveBeenCalled();
        expect(doubleFunc).not.toHaveBeenCalled();
    });

    it('should end drawing on double click without closing path', () => {
        const points = [new Vec2(100, 800)];
        service.config.points = points;
        service.lineDrawer['shift'].isDown = true;
        const lastEvent = { x: 100, y: 100, detail: 2 } as MouseEvent;
        spyOn(service, 'draw').and.stub();
        service.onMouseDown(lastEvent);
        expect(service.draw).toHaveBeenCalled();
        expect(service.config.closedLoop).toBeFalsy();
    });

    it('should end drawing on double click with a closed path', async () => {
        service.config.points = [new Vec2(500, 400), new Vec2(200, 300), new Vec2(100, 819)];
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
        service.config.points = [new Vec2(100, 200)];
        const alignPointFunc = spyOn<any>(service.lineDrawer, 'getAlignedPoint').and.callThrough();
        service.onMouseMove({ clientX: 120, clientY: 540 } as MouseEvent);
        expect(alignPointFunc).not.toHaveBeenCalled();
        expect(service.lineDrawer['pointToAdd']).toEqual(new Vec2(120, 540));
    });

    it('should move and align line on mouse move when shift is pressed', () => {
        service.config.points = [new Vec2(100, 200)];
        service.lineDrawer['shift'].isDown = true;
        const alignPointFunc = spyOn<any>(service.lineDrawer, 'getAlignedPoint').and.returnValue(new Vec2(40, 60));
        service.onMouseMove({ clientX: 120, clientY: 540 } as MouseEvent);
        expect(alignPointFunc).toHaveBeenCalled();
        expect(service.lineDrawer['pointToAdd']).toEqual(new Vec2(40, 60));
    });

    it('should set backspace key to pressed when pressing Backspace', () => {
        service.config.points = [new Vec2(100, 300)];
        const keyEvent: KeyboardEvent = { key: 'Backspace' } as KeyboardEvent;
        service.onKeyDown(keyEvent);
        expect(service.lineDrawer['BACKSPACE'].isDown).toBe(true);
    });

    it('should not trigger event when key pressed is same as last', () => {
        service.config.points = [new Vec2(100, 300)];
        service.lineDrawer['BACKSPACE'].isDown = true;
        const keyEvent: KeyboardEvent = { key: 'Backspace' } as KeyboardEvent;
        service.onKeyDown(keyEvent);
        spyOn<any>(service.lineDrawer, 'handleKeys');
        expect(service.lineDrawer['handleKeys']).not.toHaveBeenCalled();
    });

    it('should not do anything when a random key is pressed', () => {
        const keyEvent: KeyboardEvent = { key: 'randomKey', shiftKey: false } as KeyboardEvent;
        service.onKeyDown(keyEvent);
        expect(service.lineDrawer['BACKSPACE'].isDown).toBe(false);
    });

    it('should set shift key to released when releasing Shift', () => {
        const keyEvent: KeyboardEvent = { key: 'Shift' } as KeyboardEvent;
        service.lineDrawer['shift'].isDown = true;
        service.onKeyUp(keyEvent);
        expect(service.lineDrawer['shift'].isDown).toBe(false);
    });

    it('should not do anything when a random key is released', () => {
        const keyEvent: KeyboardEvent = { key: 'randomKey', shiftKey: true } as KeyboardEvent;
        service.lineDrawer['ESCAPE'].isDown = true;
        service.onKeyUp(keyEvent);
        expect(service.lineDrawer['ESCAPE'].isDown).toBe(true);
    });

    it('should not do anything when Backspace key is released', () => {
        const keyEvent: KeyboardEvent = { key: 'Backspace' } as KeyboardEvent;
        const handlePreviewFunc = spyOn<any>(service.lineDrawer, 'renderLinePreview');
        service.onKeyUp(keyEvent);
        expect(handlePreviewFunc).not.toHaveBeenCalled();
    });

    it('should delete point and update preview on a Backspace key event when there are 2 points', () => {
        service.config.points = pointsTest2;
        service.lineDrawer['BACKSPACE'].isDown = true;
        const handlePreviewFunc = spyOn<any>(service.lineDrawer, 'renderLinePreview');
        service.lineDrawer['removeLastPoint']();
        expect(handlePreviewFunc).toHaveBeenCalled();
        expect(service.config.points.length).toBe(1);
    });

    it('should not do anything on a Backspace key event when points array is empty ', () => {
        service.lineDrawer['BACKSPACE'].isDown = true;
        const handlePreviewFunc = spyOn<any>(service.lineDrawer, 'renderLinePreview');
        service.lineDrawer['removeLastPoint']();
        expect(handlePreviewFunc).not.toHaveBeenCalled();
    });

    it('should stop drawing', () => {
        service.stopDrawing();
        expect(spyDrawing.clearCanvas).toHaveBeenCalled();
    });

    it('should handle line preview', () => {
        service.config.points = [new Vec2(100, 100)];
        service.lineDrawer['pointToAdd'] = new Vec2(200, 200);
        service['drawingService'].previewCtx = previewCtxStub;
        service.lineDrawer['renderLinePreview']();
        expect(spyDrawing.drawPreview).toHaveBeenCalled();
    });

    it('should send command to drawing service to draw on preview', () => {
        service.drawPreview();
        expect(spyDrawing.drawPreview).toHaveBeenCalled();
    });

    it('should send command to drawing service to draw on base', () => {
        service.draw();
        expect(spyDrawing.draw).toHaveBeenCalled();
    });

    it('init service should init attributes', () => {
        service['initService']();
        expect(service.lineDrawer['shift'].isDown).toBe(false);
        expect(service.lineDrawer['BACKSPACE'].isDown).toBe(false);
        expect(service.config.closedLoop).toBe(false);
        expect(service.config.points.length).toBe(0);
    });
});
