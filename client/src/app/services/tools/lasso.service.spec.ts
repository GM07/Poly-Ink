import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Line } from '@app/classes/math/line';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { Subject } from 'rxjs';
import { DrawingService } from '../drawing/drawing.service';
import { AbstractSelectionService } from './abstract-selection.service';
import { LassoService } from './lasso.service';

describe('Lasso service', () => {
    let service: LassoService;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let pointsTest: Vec2[];
    let mousePos: Vec2 = new Vec2(50, 40);

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'draw'], { changes: new Subject<void>() });
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawServiceSpy }],
        });

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(LassoService);
        service['drawingService'].canvas = document.createElement('canvas');
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].baseCtx = baseCtxStub;
        service.lineDrawer['pointToAdd'] = new Vec2(0, 0);
        service.lineDrawer['mousePosition'] = new Vec2(0, 0);
        pointsTest = [new Vec2(100, 100), new Vec2(200, 300)];
        service.lineDrawer['getPositionFromMouse'] = (event: MouseEvent) => {
            return mousePos;
        };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should init service', () => {
        spyOn<any>(service, 'initSelection').and.callFake(() => {});
        service['lines'].push(new Line(pointsTest[0], pointsTest[1]));
        service.initService();
        expect(service['lines'].length).toEqual(0);
        expect(service['initSelection']).toHaveBeenCalled();
    });

    it('should start selection on closed path', () => {
        spyOn<any>(service, 'startSelection').and.callFake(() => {});
        service['start'] = mousePos.clone();
        service['end'] = mousePos.clone();
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
        const spy = spyOn<any>(service, 'addPointToSelection').and.callFake(() => {});
        service['createSelection']({} as MouseEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should add points with 3 points on createSelection', () => {
        service.configLasso.points = pointsTest;
        service.configLasso.points.push(mousePos);
        const spy = spyOn<any>(service, 'addPointToSelection').and.callFake(() => {});
        service['createSelection']({} as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should add points with 3 points on createSelection', () => {
        service.configLasso.points = pointsTest;
        const spy = spyOn<any>(service, 'addPointToSelection').and.callFake(() => {});
        service['createSelection']({} as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should close path when adding close point', () => {
        service.configLasso.points = pointsTest;
        service.configLasso.points.push(mousePos);
        service.lineDrawer.pointToAdd = new Vec2(100, 100);
        const spy = spyOn<any>(service, 'onClosedPath').and.callFake(() => {});
        service['createSelection']({} as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should not close path when adding far point', () => {
        service.configLasso.points = pointsTest;
        service.configLasso.points.push(mousePos);
        service.lineDrawer.pointToAdd = new Vec2(100 + ToolSettingsConst.MINIMUM_DISTANCE_TO_CLOSE_PATH + 1, 100);
        const spy = spyOn<any>(service, 'onClosedPath').and.callFake(() => {});
        service['createSelection']({} as MouseEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should not do anything if mouse button is not left button', () => {
        const spy = spyOn<any>(service, 'createSelection').and.callFake(() => {});
        service.onMouseDown({ button: MouseButton.Right } as MouseEvent);
        expect(spy).not.toHaveBeenCalled();
    });

    it('should call create selection when selecting', () => {
        const spy = spyOn<any>(service, 'createSelection').and.callFake(() => {});
        service.onMouseDown({ button: MouseButton.Left } as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should call not create selection when selection is already created', () => {
        const spy = spyOn<any>(service, 'endSelection').and.callFake(() => {});
        service.configLasso.selectionCtx = {} as CanvasRenderingContext2D;
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

    it('should move selection if selection is completed', () => {
        /// ON MOUSE MOVE ELSEEE
        service.configLasso.points = pointsTest;
        service.configLasso.selectionCtx = {} as CanvasRenderingContext2D;
        const spy = spyOn(service as AbstractSelectionService, 'onMouseMove').and.callThrough();
        service.onMouseMove({} as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });

    it('should set translation mouse up', () => {
        const spy = spyOn<any>(service['selectionTranslation'], 'onMouseUp').and.callFake(() => {});
        service.leftMouseDown = true;
        service.configLasso.selectionCtx = {} as CanvasRenderingContext2D;
        service.onMouseUp({ clientX: 100, clientY: 100 } as MouseEvent);
        expect(spy).toHaveBeenCalled();
    });
});
