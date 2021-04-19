import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Tool } from '@app/classes/tool';
import { CanvasConst } from '@app/constants/canvas';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GridService } from '@app/services/drawing/grid.service';
import { MagnetismService } from '@app/services/drawing/magnetism.service';
import { PencilService } from '@app/services/tools/pencil.service';
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

    beforeEach(async(() => {
        toolStub = new ToolStub({} as DrawingService, {} as ColorService);
        const undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['init', 'saveCommand', 'undo', 'redo', 'isPreviewEmpty', 'onKeyDown']);
        const magnetismService = new MagnetismService(new GridService());
        drawingStub = new DrawingService(undoRedoServiceSpy, magnetismService);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: PencilService, useValue: toolStub },
                { provide: DrawingService, useValue: drawingStub },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
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
        const currentTool = component.TOOL_HANDLER_SERVICE.getCurrentTool();
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
        const mouseEventSpy = spyOn(component.TOOL_HANDLER_SERVICE, 'onKeyUp').and.callThrough();
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
});
