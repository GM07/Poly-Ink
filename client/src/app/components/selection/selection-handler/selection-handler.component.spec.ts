import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { EllipseSelectionComponent } from '@app/components/selection/ellipse-selection/ellipse-selection.component';
import { RectangleSelectionComponent } from '@app/components/selection/rectangle-selection/rectangle-selection.component';
import { EllipseSelectionService } from '@app/services/tools/ellipse-selection.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { RectangleSelectionService } from '@app/services/tools/rectangle-selection.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { SelectionHandlerComponent } from './selection-handler.component';

describe('SelectionHandlerComponent', () => {
    let component: SelectionHandlerComponent;
    let fixture: ComponentFixture<SelectionHandlerComponent>;
    let toolHandlerService: ToolHandlerService;
    let pencilService: PencilService;
    let rectangleSelectionService: RectangleSelectionService;
    let ellipseSelectionService: EllipseSelectionService;
    // tslint:disable:no-any
    let getToolSpy: jasmine.Spy;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SelectionHandlerComponent],
            providers: [{ provide: ToolHandlerService }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SelectionHandlerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        toolHandlerService = TestBed.inject(ToolHandlerService);
        pencilService = TestBed.inject(PencilService);
        rectangleSelectionService = TestBed.inject(RectangleSelectionService);
        ellipseSelectionService = TestBed.inject(EllipseSelectionService);

        // tslint:disable:no-any
        getToolSpy = spyOn<any>(toolHandlerService, 'getTool').and.returnValue(pencilService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('lastTool should be of type Tool', () => {
        expect(component.lastTool).toBeInstanceOf(Tool);
    });

    it('lastTab should be a undefined as default', () => {
        expect(component.lastTab).toBe(undefined);
    });

    it('activeTab should be the display of the current selection tool', () => {
        getToolSpy.and.returnValue(rectangleSelectionService);
        expect(component.activeTab).toBe(RectangleSelectionComponent);
        getToolSpy.and.returnValue(ellipseSelectionService);
        expect(component.activeTab).toBe(EllipseSelectionComponent);
    });

    it('should change the return value of activeTab for undefined when a tool that is not a selection is used', () => {
        getToolSpy.and.returnValue(rectangleSelectionService);
        expect(component.activeTab).toBe(RectangleSelectionComponent);
        getToolSpy.and.returnValue(pencilService);
        expect(component.activeTab).not.toBe(RectangleSelectionComponent);
        expect(component.activeTab).toBe(undefined);
    });

    it('the active tab should not be undefined if we use a tool that is a selection', () => {
        expect(component.activeTab).toBe(undefined);
        getToolSpy.and.returnValue(ellipseSelectionService);
        expect(component.activeTab).toBe(EllipseSelectionComponent);
        getToolSpy.and.returnValue(rectangleSelectionService);
        expect(component.activeTab).toBe(RectangleSelectionComponent);
    });
});
