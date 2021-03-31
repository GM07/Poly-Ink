import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { CanvasConst } from '@app/constants/canvas';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/drawing/grid.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { DrawingComponent } from './drawing.component';

// tslint:disable:no-string-literal

class ToolStub extends Tool {
    stopDrawing(): void {
        /**/
    }
}

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let toolStub: ToolStub;
    let drawingStub: DrawingService;
    let gridService: GridService;

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService, {} as ColorService);
        gridService = new GridService();
        const undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['init', 'saveCommand', 'undo', 'redo', 'isPreviewEmpty', 'onKeyDown']);
        drawingStub = new DrawingService(undoRedoServiceSpy, gridService);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: PencilService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
                { provide: GridService, useValue: gridService },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyOn(gridService, 'updateGrid');
        spyOn(gridService, 'upsizeGrid');
        spyOn(gridService, 'downsizeGrid');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have a default WIDTH and HEIGHT', () => {
        const height = component.height;
        const width = component.width;
        expect(height).toEqual(CanvasConst.DEFAULT_HEIGHT);
        expect(width).toEqual(CanvasConst.DEFAULT_WIDTH);
    });

    it('should get stubTool', () => {
        const currentTool = component.toolHandlerService.getCurrentTool();
        expect(currentTool).toEqual(toolStub);
    });

    it(" should call the tool's mouse down when receiving a mouse down event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseDown').and.callThrough();
        component.onMouseDown(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseUp').and.callThrough();
        component.onMouseUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the toolHandler's onKeyUp event when receiving a KeyUp event", () => {
        const event = { key: 'c' } as KeyboardEvent;
        const mouseEventSpy = spyOn(component.toolHandlerService, 'onKeyUp').and.callThrough();
        component.onKeyUp(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse leave when receiving a mouse leave event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseLeave').and.callThrough();
        component.onMouseLeave(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse enter when receiving a mouse enter event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onMouseEnter').and.callThrough();
        component.onMouseEnter(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's double click event", () => {
        const event = {} as MouseEvent;
        const mouseEventSpy = spyOn(toolStub, 'onDoubleClick').and.callThrough();
        component.onDoubleClick(event);
        expect(mouseEventSpy).toHaveBeenCalled();
        expect(mouseEventSpy).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's key up event", () => {
        const event = {} as KeyboardEvent;
        const keyboardSpy = spyOn(toolStub, 'onKeyUp').and.callThrough();
        component.onKeyUp(event);
        expect(keyboardSpy).toHaveBeenCalled();
        expect(keyboardSpy).toHaveBeenCalledWith(event);
    });

    it('should do nothing if shortcuts are blocked', () => {
        component['shortcutHandler'].blockShortcuts = true;
        spyOn(component['gridService'], 'onKeyDown');
        component.onKeyDown({} as KeyboardEvent);
        expect(component['gridService'].onKeyDown).not.toHaveBeenCalled();
    });

    it('should transfer keydown to grid service', () => {
        spyOn(component['gridService'], 'onKeyDown');
        component.onKeyDown({} as KeyboardEvent);
        component['gridService'].gridVisibility = true;
        component.onKeyDown({} as KeyboardEvent);
        expect(component['gridService'].onKeyDown).toHaveBeenCalledTimes(2);
    });
});
