import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { AbstractSelectionComponent } from './abstract-selection.component';

describe('AbstractSelectionComponent', () => {
    let component: AbstractSelectionComponent;
    let fixture: ComponentFixture<AbstractSelectionComponent>;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let abstractSelectionService: AbstractSelectionService;
    let mouseEvent = {
        offsetX: 25,
        offsetY: 25,
        button: 0,
    } as MouseEvent;

    let keyboardEvent = {
        shiftKey: true,
    } as KeyboardEvent;

    beforeEach(async(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        TestBed.configureTestingModule({
            declarations: [AbstractSelectionComponent],
            providers: [AbstractSelectionService, { provide: DrawingService, useValue: drawServiceSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        abstractSelectionService = TestBed.inject(AbstractSelectionService);
        fixture = TestBed.createComponent(AbstractSelectionComponent);
        component = fixture.componentInstance;
        drawServiceSpy.canvas = canvasTestHelper.canvas;
        drawServiceSpy.previewCanvas = canvasTestHelper.canvas;
        drawServiceSpy.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawServiceSpy.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('it should disable control if in selection on mouse down', () => {
        spyOn(abstractSelectionService, 'isInSelection').and.returnValue(true);
        spyOn(component as any, 'makeControlsUnselectable');
        component.onMouseDown(mouseEvent);
        expect((component as any).makeControlsUnselectable).toHaveBeenCalled();
    });

    it('should update control points on mouse down', () => {
        let controlSaveBoolean = (component.displayControlPoints = true);
        component.onMouseDown(mouseEvent);
        expect(controlSaveBoolean).not.toEqual(component.displayControlPoints);
    });

    it('should enable control point if there are control point', () => {
        component.displayControlPoints = true;
        spyOn(component as any, 'makeControlsSelectable');
        spyOn(component as any, 'placePoints');
        component.onMouseUp();
        expect((component as any).makeControlsSelectable).toHaveBeenCalled();
        expect((component as any).placePoints).toHaveBeenCalled();
    });

    it('should update control points on mouse up', () => {
        let controlSaveBoolean = (component.displayControlPoints = false);
        abstractSelectionService.selectionCtx = drawServiceSpy.previewCtx;
        component.onMouseUp();
        expect(controlSaveBoolean).not.toEqual(component.displayControlPoints);
    });

    it('should update the cursor when hovering the selection', () => {
        spyOn(abstractSelectionService, 'isInSelection').and.returnValue(true);
        component.onMouseMove(mouseEvent);
        expect(drawServiceSpy.previewCanvas.style.cursor).toEqual('all-scroll');
    });

    it('should reset the cursor when not hovering the selection', () => {
        spyOn(abstractSelectionService, 'isInSelection').and.returnValue(false);
        (component as any).lastCursor = 'pointer';
        component.onMouseMove(mouseEvent);
        expect(drawServiceSpy.previewCanvas.style.cursor).toEqual('pointer');
    });

    it("should do nothing if mouse is down and we're not diplaying the control points", () => {
        component.mouseDown = true;
        spyOn(component as any, 'placePoints');
        component.onMouseMove(mouseEvent);
        expect((component as any).placePoints).not.toHaveBeenCalled();
    });

    it('should update the control point on mouse move', () => {
        component.displayControlPoints = true;
        component.mouseDown = true;
        spyOn(component as any, 'placePoints');
        spyOn(component as any, 'makeControlsUnselectable');
        component.onMouseMove(mouseEvent);
        expect((component as any).placePoints).toHaveBeenCalled();
        expect((component as any).makeControlsUnselectable).toHaveBeenCalled();
    });

    it('should update the control point on key down', () => {
        component.displayControlPoints = true;
        spyOn(component as any, 'placePoints');
        component.onKeyDown(keyboardEvent);
        expect((component as any).placePoints).toHaveBeenCalled();
    });

    it('should update the display of control points on key down', () => {
        let saveValue = (component.displayControlPoints = true);
        component.onKeyDown(keyboardEvent);
        expect(component.displayControlPoints).not.toEqual(saveValue);
    });

    it('init point should initialise the control points', () => {
        spyOn(component as any, 'placePoints');
        component.displayControlPoints = true;
        fixture.detectChanges();
        component.initPoints();
        expect((component as any).placePoints).toHaveBeenCalled();
        expect((component as any).controlPointList.length).toBeGreaterThan(0);
    });
});
