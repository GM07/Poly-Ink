import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { LassoDraw } from '@app/classes/commands/lasso-draw';
import { LineDrawer } from '@app/classes/line-drawer';
import { Line } from '@app/classes/math/line';
import { LassoConfig } from '@app/classes/tool-config/lasso-config';
import { Vec2 } from '@app/classes/vec2';
import { CanvasConst } from '@app/constants/canvas';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';
import { AbstractSelectionService } from './abstract-selection.service';
import { LassoService } from './lasso.service';

/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
/* tslint:disable:no-any */
/* tslint:disable:no-empty */
describe('Lasso service', () => {
    let service: LassoService;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let pointsTest: Vec2[];
    const mousePos: Vec2 = new Vec2(50, 40);

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'draw', 'drawPreview'], { changes: new Subject<void>() });
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(LassoService);
        service['drawingService'].canvas = document.createElement('canvas');
        service['drawingService'].canvas.width = CanvasConst.MIN_WIDTH;
        service['drawingService'].canvas.height = CanvasConst.MIN_HEIGHT;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].baseCtx = baseCtxStub;
        service.lineDrawer['pointToAdd'] = new Vec2(0, 0);
        service.lineDrawer['mousePosition'] = new Vec2(0, 0);
        pointsTest = [new Vec2(100, 100), new Vec2(200, 300)];
        service.lineDrawer['getPositionFromMouse'] = (event: MouseEvent) => {
            return mousePos;
        };
        service['start'] = mousePos.clone();
        service['end'] = mousePos.clone();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should init attribs', () => {
        service['lines'].push(new Line(pointsTest[0], pointsTest[1]));
        service.initAttribs(new LassoConfig());
        expect(service['lines'].length).toEqual(0);
    });

    it('should start selection on closed path', () => {
        service['configLasso'].points = pointsTest;
        spyOn<any>(service, 'startSelection');
        service['onClosedPath']();
        expect(service['startSelection']).toHaveBeenCalled();
    });

    it('should add point to selection', () => {
        service.configLasso.points = pointsTest;
        service['addPointToSelection']({ clientX: 10, clientY: 10 } as MouseEvent);
        expect(service.configLasso.points.length).toEqual(3);
    });

    it('should add line if there are at least 2 points', () => {
        service.configLasso.points = pointsTest;
        service['addNewLine']();
        expect(service['lines'].length).toEqual(1);
    });

    it('should not add line if there is only one point', () => {
        service['addNewLine']();
        expect(service['lines'].length).toEqual(0);
    });

    it('should not create selection if intersecting', () => {
        service.configLasso.intersecting = true;
        service.configLasso.points = pointsTest;
        const spy = spyOn<any>(service, 'addPointToSelection');
        service['createSelection']({} as MouseEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should add points with 3 points on createSelection', () => {
        service.configLasso.points = pointsTest;
        service.configLasso.points.push(mousePos);
        const spy = spyOn<any>(service, 'addPointToSelection');
        service['createSelection']({} as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should add points with 3 points on createSelection', () => {
        service.configLasso.points = pointsTest;
        const spy = spyOn<any>(service, 'addPointToSelection');
        service['createSelection']({} as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should close path when adding close point', () => {
        service.configLasso.points = pointsTest;
        service.configLasso.points.push(mousePos);
        service.lineDrawer.pointToAdd = new Vec2(100, 100);
        const spy = spyOn<any>(service, 'onClosedPath');
        service['createSelection']({} as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should not close path when adding far point', () => {
        service.configLasso.points = pointsTest;
        service.configLasso.points.push(mousePos);
        service.lineDrawer.pointToAdd = new Vec2(100 + ToolSettingsConst.MINIMUM_DISTANCE_TO_CLOSE_PATH + 1, 100);
        const spy = spyOn<any>(service, 'onClosedPath');
        service['createSelection']({} as MouseEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should not do anything if mouse button is not left button', () => {
        const spy = spyOn<any>(service, 'createSelection');
        service.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call create selection when selecting', () => {
        const spy = spyOn<any>(service, 'createSelection');
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call not create selection when selection is already created', () => {
        const spy = spyOn<any>(service, 'endSelection');
        service.configLasso.previewSelectionCtx = {} as CanvasRenderingContext2D;
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should not react to mouse move if points array is empty', () => {
        const spy = spyOn(service.lineDrawer, 'followCursor').and.callThrough();
        service.onMouseMove({} as MouseEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should follow cursor on mouse move', () => {
        service.configLasso.points = pointsTest;
        const spy = spyOn(service.lineDrawer, 'followCursor').and.callThrough();
        service.onMouseMove({ clientX: {}, clientY: {} } as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should let parent handle mouse move if selection is completed', () => {
        service.configLasso.points = pointsTest;
        service.configLasso.previewSelectionCtx = service['drawingService'].baseCtx;
        const spy = spyOn(AbstractSelectionService.prototype, 'onMouseMove').and.callThrough();
        service.onMouseMove({ clientX: 10, clientY: 10 } as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should set translation mouse up', () => {
        const spy = spyOn<any>(service['selectionTranslation'], 'onMouseUp');
        service.leftMouseDown = true;
        service.configLasso.previewSelectionCtx = service['drawingService'].baseCtx;
        service.onMouseUp({ clientX: 100, clientY: 100 } as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should not set translation mouse up if not left button was not down', () => {
        const spy = spyOn<any>(service['selectionTranslation'], 'onMouseUp');
        service.leftMouseDown = false;
        service.onMouseUp({ clientX: 100, clientY: 100 } as MouseEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should only update mouse up coord on mouse up if selection was not completed', () => {
        const spy = spyOn<any>(service['selectionTranslation'], 'onMouseUp');
        service.leftMouseDown = true;
        service.onMouseUp({ clientX: 100, clientY: 100 } as MouseEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should handle keys itself when key is pressed', () => {
        service.configLasso.points = pointsTest;
        const spy = spyOn(service.lineDrawer, 'handleKeys').and.callThrough();
        service.onKeyDown({ key: 'backspace', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should not do anything if key pressed is not in shortcut list', () => {
        const spy = spyOn(service.lineDrawer, 'handleKeys').and.callThrough();
        service.onKeyDown({ key: 't', ctrlKey: true, shiftKey: false, altKey: false } as KeyboardEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should let parent handle keys when key is pressed if selection is completed', () => {
        service.configLasso.previewSelectionCtx = service['drawingService'].baseCtx;
        const spy = spyOn(AbstractSelectionService.prototype, 'onKeyDown');
        service.onKeyDown({} as KeyboardEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should handle keys itself when key is up', () => {
        const spy = spyOn(service.lineDrawer, 'handleKeys').and.callThrough();
        service.onKeyUp({ key: 'backspace', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should not do anything if key up is not in shortcut list', () => {
        const spy = spyOn(service.lineDrawer, 'handleKeys').and.callThrough();
        service.onKeyUp({ key: 't', ctrlKey: true, shiftKey: false, altKey: false } as KeyboardEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should let parent handle keys when key is up if selection is completed', () => {
        service.configLasso.previewSelectionCtx = service['drawingService'].baseCtx;
        const spy = spyOn(AbstractSelectionService.prototype, 'onKeyUp');
        service.onKeyUp({} as KeyboardEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should find smallest rectangle', () => {
        service['drawingService'].canvas.width = 2000;
        service['drawingService'].canvas.height = 2000;
        service.configLasso.points = [new Vec2(10, 1000), new Vec2(30, 950), new Vec2(500, 300)];
        const [start, end] = service['findSmallestRectangle']();
        expect(start).toEqual(new Vec2(10, 300));
        expect(end).toEqual(new Vec2(500, 1000));
    });

    it('should execute command on draw', () => {
        service['draw']();
        expect(drawServiceSpy.draw).toHaveBeenCalled();
    });

    it('should execute command on drawPreview', () => {
        service['drawPreview']();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
    });

    it('should init service when ending selection', () => {
        const spy = spyOn(service, 'initAttribs').and.callThrough();
        service.configLasso.previewSelectionCtx = service['drawingService'].baseCtx;
        service['endSelection']();
        expect(spy).toHaveBeenCalled();
    });

    it('should draw white background when selection is completed', () => {
        const drawSpy = spyOn(LineDrawer, 'drawFilledLinePath');
        const changeSpy = spyOn(service.configLasso, 'didChange').and.returnValue(false);
        service['fillBackground']({} as CanvasRenderingContext2D);
        expect(drawSpy).not.toHaveBeenCalled();
        changeSpy.and.returnValue(true);
        service['fillBackground']({} as CanvasRenderingContext2D);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('should update selection with clipped line path', () => {
        const clipSpy = spyOn(LassoDraw, 'drawClippedSelection');
        const dashedLineSpy = spyOn(LineDrawer, 'drawDashedLinePath');
        service['updateSelectionRequired']();
        expect(dashedLineSpy).toHaveBeenCalled();
        expect(clipSpy).toHaveBeenCalled();
    });

    it('should correctly offset every point when updating the selection', () => {
        service['configLasso'].startCoords = new Vec2(0, 0);
        service['configLasso'].endCoords = new Vec2(1, 1);
        service['configLasso'].points = [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0)];
        service['configLasso'].originalPoints = [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0)];
        service['configLasso'].scaleFactor = new Vec2(1, 1);
        service['configLasso'].width = 1;
        service['configLasso'].height = 1;
        service['configLasso'].originalWidth = 1;
        service['configLasso'].originalHeight = 1;
        service['updateSelectionRequired']();
        for (const point of service['configLasso'].points) expect(point).toEqual(new Vec2(1, 1));

        service['configLasso'].scaleFactor = new Vec2(-1, -1);
        service['updateSelectionRequired']();
        for (const point of service['configLasso'].points) expect(point).toEqual(new Vec2(2, 2));
    });

    it('should select all', () => {
        const closedSpy = spyOn<any>(service, 'onClosedPath');
        service.selectAll();
        expect(service.configLasso.points).toEqual([
            new Vec2(0, 0),
            new Vec2(CanvasConst.MIN_WIDTH, 0),
            new Vec2(CanvasConst.MIN_WIDTH, CanvasConst.MIN_HEIGHT),
            new Vec2(0, CanvasConst.MIN_HEIGHT),
        ]);

        expect(closedSpy).toHaveBeenCalled();
    });

    it('should stop drawing', () => {
        const initSpy = spyOn(service, 'initAttribs');
        const stopSpy = spyOn<any>(AbstractSelectionService.prototype, 'stopDrawing');
        service.stopDrawing();
        expect(initSpy).toHaveBeenCalled();
        expect(stopSpy).toHaveBeenCalled();
    });
});
