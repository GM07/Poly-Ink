import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Color } from 'src/color-picker/classes/color';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { PolygoneService } from './polygone.service';
// tslint:disable:no-any
describe('PolygoneService', () => {
    let service: PolygoneService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let canvasTestHelper: CanvasTestHelper;
    let previewCtxStub: CanvasRenderingContext2D;
    let baseCtxStub: CanvasRenderingContext2D;

    let drawSpy: jasmine.Spy<any>;
    let drawPreviewSpy: jasmine.Spy<any>;

    let mouseEvent: MouseEvent;
    const INIT_OFFSET_X = 25;
    const INIT_OFFSET_Y = 25;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'draw', 'drawPreview']);

        colorServiceSpy = jasmine.createSpyObj('ColorService', [], {
            primaryRgba: new Color(1, 1, 1).toRgbaString(1),
            secondaryRgba: Colors.BLACK.toRgbaString(1),
        });

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorService, useValue: colorServiceSpy },
            ],
        });

        service = TestBed.inject(PolygoneService);
        drawSpy = spyOn<any>(service, 'draw').and.stub();
        drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.stub();

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        mouseEvent = {
            clientX: INIT_OFFSET_X,
            clientY: INIT_OFFSET_Y,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should change to a valid contourWidth', () => {
        const validWidthValue = 2;
        service.contourWidth = validWidthValue;
        expect(service.contourWidth).toEqual(2);
    });

    it('should prevent change to an invalid contourWidth value', () => {
        const invalidWidthValue = 51;
        service.contourWidth = invalidWidthValue;
        expect(service.contourWidth).toEqual(ToolSettingsConst.MAX_WIDTH);
    });

    it('should change to a valid numberEdges', () => {
        const validNumEdgesValue = 5;
        service.numEdges = validNumEdgesValue;
        expect(service.numEdges).toEqual(validNumEdgesValue);
    });

    it('should prevent change to an invalid numEdges value', () => {
        const invalidNumEdges = 14;
        service.numEdges = invalidNumEdges;
        expect(service.numEdges).toEqual(ToolSettingsConst.MIN_NUM_EDGES);
    });

    it('should not draw when the mouse is up', () => {
        service.leftMouseDown = false;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it('should not start drawing when the mouse is moving but it is not the right button', () => {
        mouseEvent = { clientX: 1, clientY: 1, button: 3 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it('should not start drawing when the mouse is down but it is not the right button', () => {
        mouseEvent = { clientX: 1, clientY: 1, button: 3 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it('should start drawing when the mouse is down on the left click', () => {
        service.leftMouseDown = true;
        mouseEvent = { clientX: 0, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('should stop drawing when the mouse is up', () => {
        service.onMouseUp(mouseEvent);
        expect(service.leftMouseDown).toEqual(false);
        service.onMouseDown(mouseEvent);
        mouseEvent = { x: -1, y: -1, clientX: 1, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('should clear the canvas when stops drawing when asked to', () => {
        service.leftMouseDown = true;
        service.onMouseDown(mouseEvent);
        service.stopDrawing();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should draw a preview when the mouse is moving with left clicked pressed', () => {
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: INIT_OFFSET_X - 1, clientY: INIT_OFFSET_Y + 1, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('should update the polygone when then mouse leaves', () => {
        service.onMouseLeave(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        service.onMouseLeave(mouseEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: INIT_OFFSET_X + 1, clientY: INIT_OFFSET_Y + 1, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).toHaveBeenCalled();
    });

    it('should update the polygone when the mouse enters', () => {
        service.onMouseEnter(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: INIT_OFFSET_X + 1, clientY: INIT_OFFSET_Y - 1, button: 0 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(drawPreviewSpy);
    });

    it('should send command to drawing service to draw on preview', () => {
        drawPreviewSpy.and.callThrough();
        service.drawPreview();
        expect(drawServiceSpy.drawPreview).toHaveBeenCalled();
    });

    it('should send command to drawing service to draw on base', () => {
        drawSpy.and.callThrough();
        service.draw();
        expect(drawServiceSpy.draw).toHaveBeenCalled();
    });

    it('should not update rectangle end coordinates to mousePosition when mouseup outside canvas', () => {
        mouseEvent = {
            offsetX: baseCtxStub.canvas.width + 1,
            offsetY: baseCtxStub.canvas.width + 1,
            button: 0,
        } as MouseEvent;
        service.leftMouseDown = true;
        service.onMouseUp(mouseEvent);
        spyOn(service, 'getPositionFromMouse').and.stub();
        expect(service.getPositionFromMouse).not.toHaveBeenCalled();
    });
});
