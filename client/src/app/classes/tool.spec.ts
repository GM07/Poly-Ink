import { TestBed } from '@angular/core/testing';
import { Colors } from '@app/constants/colors';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { CanvasTestHelper } from './canvas-test-helper';
import { Tool } from './tool';
import { Vec2 } from './vec2';

class ToolStub extends Tool {}

// tslint:disable:no-string-literal
// tslint:disable:no-any
describe('Tool', () => {
    let tool: Tool;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'draw', 'drawPreview']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', [], { primaryColor: Colors.BLACK, primaryColorAlpha: 1.0 });

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorService, useValue: colorServiceSpy },
            ],
        });
        tool = new ToolStub(drawServiceSpy, colorServiceSpy);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        tool['drawingService'].canvas = canvasTestHelper.canvas;
        spyOn(tool['drawingService'].canvas, 'getBoundingClientRect').and.returnValue({ x: 0, y: 0, width: 2, height: 2 } as DOMRect);
    });

    it('should be created', () => {
        expect(tool).toBeTruthy();
    });

    it('should indicate if we are in the canvas', () => {
        spyOn<any>(tool, 'getBorder').and.returnValue(0);
        expect(tool.isInCanvas({ x: 1, y: 1 } as MouseEvent)).toBeTruthy();
        // tslint:disable-next-line:no-magic-numbers
        expect(tool.isInCanvas({ x: 3, y: 3 } as MouseEvent)).toBeFalsy();
    });

    it('onMouseDown should be defined', () => {
        tool.onMouseDown({} as MouseEvent);
        expect(tool.onMouseDown).toBeTruthy();
    });

    it('onDoubleClick should be defined', () => {
        tool.onDoubleClick({} as MouseEvent);
        expect(tool.onDoubleClick).toBeTruthy();
    });

    it('onMouseUp should be defined', () => {
        tool.onMouseUp({} as MouseEvent);
        expect(tool.onMouseUp).toBeTruthy();
    });

    it('onMouseMove should be defined', () => {
        tool.onMouseMove({} as MouseEvent);
        expect(tool.onMouseMove).toBeTruthy();
    });

    it('onMouseLeave should be defined', () => {
        tool.onMouseLeave({} as MouseEvent);
        expect(tool.onMouseLeave).toBeTruthy();
    });

    it('onMouseEnter should be defined', () => {
        tool.onMouseEnter({} as MouseEvent);
        expect(tool.onMouseEnter).toBeTruthy();
    });

    it('onKeyDown should be defined', () => {
        tool.onKeyDown({} as KeyboardEvent);
        expect(tool.onKeyDown).toBeTruthy();
    });

    it('onKeyUp should be defined', () => {
        tool.onKeyUp({} as KeyboardEvent);
        expect(tool.onKeyUp).toBeTruthy();
    });

    it('onMouseClick should be defined', () => {
        tool.onMouseClick({} as MouseEvent);
        expect(tool.onMouseClick).toBeTruthy();
    });

    it('stopDrawing should be defined', () => {
        tool.stopDrawing();
        expect(tool.stopDrawing).toBeTruthy();
    });

    it('should return the current position for the mouse', () => {
        spyOn<any>(tool, 'getBorder').and.returnValue(0);
        expect(tool.getPositionFromMouse({ clientX: 1, clientY: 1 } as MouseEvent)).toEqual(new Vec2(1, 1));
    });

    it('should return the border size', () => {
        spyOn(window.getComputedStyle(tool['drawingService'].canvas), 'getPropertyValue').and.returnValue('0px');
        expect(tool['getBorder']()).toEqual(0);
    });
});
