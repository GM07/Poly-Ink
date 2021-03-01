import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { AbstractSelectionComponent } from './abstract-selection.component';

describe('AbstractSelectionComponent', () => {
    let component: AbstractSelectionComponent;
    let fixture: ComponentFixture<AbstractSelectionComponent>;
    let drawService: DrawingService;
    let abstractSelectionService: AbstractSelectionService;
    let mouseEvent = {
        offsetX: 25,
        offsetY: 25,
        button: 0,
    } as MouseEvent;

    //const delay = async (ms: number) => new Promise((result) => setTimeout(result, ms));
    beforeEach(async(() => {
        drawService = new DrawingService();
        TestBed.configureTestingModule({
            declarations: [AbstractSelectionComponent],
            providers: [AbstractSelectionService, { provide: DrawingService, useValue: drawService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        abstractSelectionService = TestBed.inject(AbstractSelectionService);
        drawService.canvas = document.createElement('canvas');
        drawService.previewCanvas = document.createElement('canvas');
        drawService.baseCtx = drawService.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawService.previewCtx = drawService.previewCanvas.getContext('2d') as CanvasRenderingContext2D;
        fixture = TestBed.createComponent(AbstractSelectionComponent);
        component = fixture.componentInstance;
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
        abstractSelectionService.selectionCtx = drawService.previewCtx;
        component.onMouseUp();
        expect(controlSaveBoolean).not.toEqual(component.displayControlPoints);
    });

    it('should update the cursor when hovering the selection', () => {
        spyOn(abstractSelectionService, 'isInSelection').and.returnValue(true);
        component.onMouseMove(mouseEvent);
        expect(drawService.previewCanvas.style.cursor).toEqual('all-scroll');
    });

    it('should reset the cursor when not hovering the selection', () => {
        spyOn(abstractSelectionService, 'isInSelection').and.returnValue(false);
        (component as any).lastCursor = 'pointer';
        component.onMouseMove(mouseEvent);
        expect(drawService.previewCanvas.style.cursor).toEqual('pointer');
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

    it('init point should initialise the control points', () => {
        spyOn(component as any, 'placePoints');
        component.displayControlPoints = true;
        fixture.detectChanges();
        component.initPoints();
        expect((component as any).placePoints).toHaveBeenCalled();
        expect((component as any).controlPointList.length).toBeGreaterThan(0);
    });

    it('place points should set all 8 points', () => {
        abstractSelectionService['selectionCtx'] = drawService.previewCtx;
        const numberOfPoints = 8;
        spyOn<any>(component, 'placeControlPoint');
        component.displayControlPoints = true;
        fixture.detectChanges();
        component.initPoints();
        component['placePoints']();
        expect(component['placeControlPoint']).toHaveBeenCalledTimes(numberOfPoints * 2);
    });

    it('elements in canvas should be visible', () => {
        abstractSelectionService['selectionCtx'] = drawService.previewCtx;
        spyOn<any>(component, 'placeControlPoint');
        spyOn<any>(component, 'isInCanvas').and.returnValue(true);
        component.displayControlPoints = true;
        fixture.detectChanges();
        component.initPoints();
        component['placePoints']();
        expect(component['controlPointList'][0].nativeElement.style.opacity).toEqual('1');
    });

    it('place control point should update the left and top style of an html element', () => {
        component.displayControlPoints = true;
        fixture.detectChanges();
        const topSave: string = component.topLeft.nativeElement.style.top;
        const leftSave: string = component.topLeft.nativeElement.style.top;
        component['placeControlPoint'](component.topLeft, 5, 5);
        expect(component.topLeft.nativeElement.style.top).not.toEqual(topSave);
        expect(component.topLeft.nativeElement.style.top).not.toEqual(leftSave);
    });

    it('make control unselectable should set the pointer event to none', () => {
        component.displayControlPoints = true;
        fixture.detectChanges();
        component.initPoints();
        component['makeControlsUnselectable']();
        expect(component['controlPointList'][0].nativeElement.style.pointerEvents).toEqual('none');
    });

    it('make control unselectable should set the pointer event to none', () => {
        component.displayControlPoints = true;
        fixture.detectChanges();
        component.initPoints();
        component['makeControlsSelectable']();
        expect(component['controlPointList'][0].nativeElement.style.pointerEvents).toEqual('auto');
    });

    it('is in canvas should return true if the position is in the canvas', () => {
        spyOn(drawService.canvas, 'getBoundingClientRect').and.returnValue({ x: 0, y: 0, width: 100, height: 100 } as DOMRect);
       expect(component['isInCanvas']({ x: 1, y: 1 } as Vec2)).toBe(true);
    });

    it('should update control point on init if update is true', () => {
      component['displayControlPoints']  = true;
      spyOn<any>(component, 'placePoints');
      abstractSelectionService['updatePoints'].next(true);
      expect(component['placePoints']).toHaveBeenCalled();
    });

    it('should not update control point on init if update is false', () => {
      component['displayControlPoints']  = true;
      spyOn<any>(component, 'placePoints');
      abstractSelectionService['updatePoints'].next(false);
      expect(component['placePoints']).not.toHaveBeenCalled();
    });

    it('should not update control point on init if update is false', () => {
      component['displayControlPoints']  = false;
      spyOn<any>(component, 'placePoints');
      abstractSelectionService['updatePoints'].next(true);
      expect(component['placePoints']).not.toHaveBeenCalled();
    });
});
