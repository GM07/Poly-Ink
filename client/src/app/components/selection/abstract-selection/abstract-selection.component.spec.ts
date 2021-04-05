import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionEventsService } from '@app/services/selection/selection-events.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { AbstractSelectionComponent } from './abstract-selection.component';

// tslint:disable:no-any
// tslint:disable:no-magic-numbers
// tslint:disable:no-string-literal
describe('AbstractSelectionComponent', () => {
    let component: AbstractSelectionComponent;
    let fixture: ComponentFixture<AbstractSelectionComponent>;
    let drawService: DrawingService;
    let abstractSelectionService: AbstractSelectionService;
    let selectionEventsService: SelectionEventsService;

    const mouseEvent = {
        offsetX: 25,
        offsetY: 25,
        button: 0,
    } as MouseEvent;

    beforeEach(async(() => {
        const undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['init', 'saveCommand', 'undo', 'redo', 'isPreviewEmpty', 'onKeyDown']);
        const gridServiceSpy = jasmine.createSpyObj('GridService', ['updateGrid']);
        drawService = new DrawingService(undoRedoServiceSpy, gridServiceSpy);
        TestBed.configureTestingModule({
            declarations: [AbstractSelectionComponent],
            providers: [AbstractSelectionService, { provide: DrawingService, useValue: drawService }, SelectionEventsService],
        }).compileComponents();
    }));

    beforeEach(() => {
        abstractSelectionService = TestBed.inject(AbstractSelectionService);
        selectionEventsService = TestBed.inject(SelectionEventsService);
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

    it('should subscribe on init', () => {
        component['isInSidebar'] = false;
        selectionEventsService.onMouseEnterEvent.next();
        expect(component['isInSidebar']).toBeTruthy();
        selectionEventsService.onMouseLeaveEvent.next();
        expect(component['isInSidebar']).toBeFalsy();
    });

    it('it should disable control if in selection on mouse down', () => {
        const makeControlsUnselectable = spyOn<any>(component, 'makeControlsUnselectable');
        component['isInSidebar'] = true;
        component['selectionService']['config'].previewSelectionCtx = null;
        component.onMouseDown(mouseEvent);
        expect(makeControlsUnselectable).not.toHaveBeenCalled();
        component['isInSidebar'] = false;
        component.onMouseDown(mouseEvent);
        expect(makeControlsUnselectable).toHaveBeenCalled();
    });

    it('should confirm selection on mouse down outside of the selection', () => {
        const stopDrawingSpy = spyOn(component['selectionService'], 'stopDrawing');
        component['isInSidebar'] = true;
        component.confirmSelection(mouseEvent);
        expect(stopDrawingSpy).not.toHaveBeenCalled();
        component['isInSidebar'] = false;
        component['selectionService']['config'].previewSelectionCtx = drawService.previewCtx;
        component.confirmSelection(mouseEvent);
        expect(stopDrawingSpy).toHaveBeenCalled();
    });

    it('should change translationOrigin when mouseDown and in selection', () => {
        spyOn(abstractSelectionService, 'getPositionFromMouse');
        spyOn<any>(component, 'makeControlsUnselectable');
        component.onMouseDown(mouseEvent);
        expect(abstractSelectionService.getPositionFromMouse).toHaveBeenCalled();
    });

    it('should enable the controls points selection if there are controls points', () => {
        const makeControlsSelectable = spyOn<any>(component, 'makeControlsSelectable');
        component.displayControlPoints = false;
        component.onMouseUp();
        expect(makeControlsSelectable).not.toHaveBeenCalled();
        component.displayControlPoints = true;
        component.onMouseUp();
        expect(makeControlsSelectable).toHaveBeenCalled();
    });

    it('should update control points on mouse up', () => {
        const controlSaveBoolean = (component.displayControlPoints = false);
        abstractSelectionService['config'].previewSelectionCtx = drawService.previewCtx;
        component.onMouseUp();
        expect(controlSaveBoolean).not.toEqual(component.displayControlPoints);
    });

    it('should check for change and init points detection when the control points are first displayed', () => {
        spyOn<any>(component, 'initPoints');
        component.displayControlPoints = false;
        component['updateControlPointDisplay'](true);
        expect(component['initPoints']).toHaveBeenCalled();
    });

    it('init point should initialise the control points', () => {
        const placePoints = spyOn<any>(component, 'placePoints');
        component.displayControlPoints = true;
        fixture.detectChanges();
        component['initPoints']();
        expect(placePoints).toHaveBeenCalled();
        expect(component['controlPointList'].length).toBeGreaterThan(0);
    });

    it('place points should set all 8 points', () => {
        abstractSelectionService['config'].previewSelectionCtx = drawService.previewCtx;
        const numberOfPoints = 8;
        const placeControlPoint = spyOn<any>(component, 'placeControlPoint');
        component.displayControlPoints = true;
        fixture.detectChanges();
        component['initPoints']();
        component['placePoints']();
        expect(placeControlPoint).toHaveBeenCalledTimes(numberOfPoints * 2);
    });

    it('elements in canvas should be visible', () => {
        abstractSelectionService['config'].previewSelectionCtx = drawService.previewCtx;
        spyOn<any>(component, 'placeControlPoint');
        component.displayControlPoints = true;
        fixture.detectChanges();
        component['initPoints']();
        component['placePoints']();
        expect(component['controlPointList'][0].nativeElement.style.opacity).not.toEqual('1');
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
        component['initPoints']();
        component['makeControlsUnselectable']();
        expect(component['controlPointList'][0].nativeElement.style.pointerEvents).toEqual('none');
    });

    it('make control unselectable should set the pointer event to none', () => {
        component.displayControlPoints = true;
        fixture.detectChanges();
        component['initPoints']();
        component['makeControlsSelectable']();
        expect(component['controlPointList'][0].nativeElement.style.pointerEvents).toEqual('auto');
    });

    it('should update control point on init if update is true', () => {
        component.displayControlPoints = false;
        const placePoints = spyOn<any>(component, 'placePoints');
        abstractSelectionService.UPDATE_POINTS.next(true);
        expect(placePoints).toHaveBeenCalled();
        component.displayControlPoints = true;
        abstractSelectionService.UPDATE_POINTS.next(true);
        expect(placePoints).toHaveBeenCalledTimes(2);
    });

    it('should not update control point on init if update is false', () => {
        component.displayControlPoints = false;
        const placePoints = spyOn<any>(component, 'placePoints');
        abstractSelectionService.UPDATE_POINTS.next(false);
        expect(placePoints).not.toHaveBeenCalled();
    });
});
