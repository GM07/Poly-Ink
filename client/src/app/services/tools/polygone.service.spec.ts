import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Color } from 'src/color-picker/classes/color';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { PolygoneMode, PolygoneService } from './polygone.service';
// tslint:disable:no-any
describe('PolygoneService', () => {
    let service: PolygoneService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let canvasTestHelper: CanvasTestHelper;
    let previewCtxStub: CanvasRenderingContext2D;
    let baseCtxStub: CanvasRenderingContext2D;

    let drawPolygoneSpy: jasmine.Spy<any>;
    let updatePolygoneSpy: jasmine.Spy<any>;

    let mouseEvent: MouseEvent;
    const INIT_OFFSET_X = 25;
    const INIT_OFFSET_Y = 25;
    const GRAY_RGB = 128;
    const PRIMARY_RGB = new Color(1, 1, 1);
    const SECONDARY_RGB = Colors.BLACK;
    const ALPHA = 3;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);

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
        drawPolygoneSpy = spyOn<any>(service, 'drawPolygone').and.callThrough();
        updatePolygoneSpy = spyOn<any>(service, 'updatePolygone').and.callThrough();

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
        expect(drawPolygoneSpy).not.toHaveBeenCalled();
    });

    it('should not start drawing when the mouse is moving but it is not the right button', () => {
        mouseEvent = { clientX: 1, clientY: 1, button: 3 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawPolygoneSpy).not.toHaveBeenCalled();
    });

    it('should not start drawing when the mouse is down but it is not the right button', () => {
        mouseEvent = { clientX: 1, clientY: 1, button: 3 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(drawPolygoneSpy).not.toHaveBeenCalled();
    });

    it('should start drawing when the mouse is down on the left click', () => {
        service.leftMouseDown = true;
        mouseEvent = { clientX: 0, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(drawPolygoneSpy).toHaveBeenCalled();
    });

    it('should stop drawing when the mouse is up', () => {
        service.onMouseUp(mouseEvent);
        expect(service.leftMouseDown).toEqual(false);
        service.onMouseDown(mouseEvent);
        mouseEvent = { x: -1, y: -1, clientX: 1, clientY: 1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawPolygoneSpy).toHaveBeenCalled();
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
        expect(drawPolygoneSpy).toHaveBeenCalled();
    });

    it('should update the polygone when then mouse leaves', () => {
        service.onMouseLeave(mouseEvent);
        expect(updatePolygoneSpy).not.toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        service.onMouseLeave(mouseEvent);
        expect(updatePolygoneSpy).toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: INIT_OFFSET_X + 1, clientY: INIT_OFFSET_Y + 1, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(updatePolygoneSpy).toHaveBeenCalled();
    });

    it('should update the polygone when the mouse enters', () => {
        service.onMouseEnter(mouseEvent);
        expect(updatePolygoneSpy).not.toHaveBeenCalled();
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: INIT_OFFSET_X + 1, clientY: INIT_OFFSET_Y - 1, button: 0 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(updatePolygoneSpy);
    });

    it('should draw preview circle when drawing', () => {
        service.polygoneMode = PolygoneMode.Contour;
        service.contourWidth = 1;
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 0, clientY: 0, button: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawPolygoneSpy).toHaveBeenCalled();

        const middlePoint = INIT_OFFSET_X / 2;
        const previewImageData = previewCtxStub.getImageData(0, middlePoint, 1, 1);

        expect(previewImageData.data[0]).toBeGreaterThanOrEqual(GRAY_RGB - 1);
        expect(previewImageData.data[0]).toBeLessThanOrEqual(GRAY_RGB); // R
        expect(previewImageData.data[1]).toBeGreaterThanOrEqual(GRAY_RGB - 1);
        expect(previewImageData.data[1]).toBeLessThanOrEqual(GRAY_RGB); // R
        expect(previewImageData.data[2]).toBeGreaterThanOrEqual(GRAY_RGB - 1);
        expect(previewImageData.data[2]).toBeLessThanOrEqual(GRAY_RGB); // R
        // The real value here is 127.5
        // Depending on which system you do this test it might return 127 or 128
        // So we check if the value is either 127 or 128
        expect(previewImageData.data[ALPHA]).not.toEqual(0); // A

        const rightRectanglePoint = INIT_OFFSET_X;
        const voidImageData = previewCtxStub.getImageData(0, rightRectanglePoint, 1, 1);
        expect(voidImageData.data[ALPHA]).toEqual(0); // A
    });

    it('should allow for contour drawing type', () => {
        service.polygoneMode = PolygoneMode.Contour;
        service.contourWidth = 1;
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 0, clientY: 0, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawPolygoneSpy).toHaveBeenCalled();

        const middlePoint = INIT_OFFSET_X / 2;
        let imageData: ImageData = baseCtxStub.getImageData(middlePoint, 0, 1, 1);

        expect(imageData.data[0]).toEqual(SECONDARY_RGB.r); // R
        expect(imageData.data[1]).toEqual(SECONDARY_RGB.g); // G
        expect(imageData.data[2]).toEqual(SECONDARY_RGB.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A

        const x = INIT_OFFSET_X / 2;
        const y = INIT_OFFSET_Y / 2;
        imageData = baseCtxStub.getImageData(x, y, 1, 1);
        expect(imageData.data[ALPHA]).toEqual(0); // A
    });

    it('should allow for filled drawing type', () => {
        service.polygoneMode = PolygoneMode.Filled;
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 0, clientY: 0, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawPolygoneSpy).toHaveBeenCalled();

        const x = INIT_OFFSET_X / 2;
        const y = INIT_OFFSET_Y / 2;
        const imageData: ImageData = baseCtxStub.getImageData(x, y, 1, 1);
        expect(imageData.data[0]).toEqual(PRIMARY_RGB.r); // R
        expect(imageData.data[1]).toEqual(PRIMARY_RGB.g); // G
        expect(imageData.data[2]).toEqual(PRIMARY_RGB.b); // B
        expect(imageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should allow for filled and contour drawing type for a triangle', () => {
        service.polygoneMode = PolygoneMode.FilledWithContour;
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 0, clientY: 0, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawPolygoneSpy).toHaveBeenCalled();

        const fillX = INIT_OFFSET_X / 2;
        const fillY = INIT_OFFSET_Y / 2;
        const fillImageData: ImageData = baseCtxStub.getImageData(fillX, fillY, 1, 1);
        expect(fillImageData.data[0]).toEqual(PRIMARY_RGB.r); // R
        expect(fillImageData.data[1]).toEqual(PRIMARY_RGB.g); // G
        expect(fillImageData.data[2]).toEqual(PRIMARY_RGB.b); // B
        expect(fillImageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should allow for filled and contour drawing type for a square', () => {
        service.polygoneMode = PolygoneMode.FilledWithContour;
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 0, clientY: 0, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawPolygoneSpy).toHaveBeenCalled();

        // tslint:disable-next-line:no-magic-numbers
        service.numEdges = 4;
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: 0, clientY: 0, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawPolygoneSpy).toHaveBeenCalled();

        const fillX: number = INIT_OFFSET_X / 2;
        const fillY: number = INIT_OFFSET_Y / 2;
        const fillImageData: ImageData = baseCtxStub.getImageData(fillX, fillY, 1, 1);
        expect(fillImageData.data[0]).toEqual(PRIMARY_RGB.r); // R
        expect(fillImageData.data[1]).toEqual(PRIMARY_RGB.g); // G
        expect(fillImageData.data[2]).toEqual(PRIMARY_RGB.b); // B
        expect(fillImageData.data[ALPHA]).not.toEqual(0); // A
        const middlePoint = INIT_OFFSET_X / 2;
        const previewImageData: ImageData = baseCtxStub.getImageData(middlePoint, 0, 1, 1);

        expect(previewImageData.data[0]).toEqual(SECONDARY_RGB.r); // R
        expect(previewImageData.data[1]).toEqual(SECONDARY_RGB.g); // G
        expect(previewImageData.data[2]).toEqual(SECONDARY_RGB.b); // B
        expect(previewImageData.data[ALPHA]).not.toEqual(0); // A
    });

    it('should do nothing with an unknown mode', () => {
        service.polygoneMode = {} as PolygoneMode;
        service.onMouseDown(mouseEvent);
        mouseEvent = { clientX: -1, clientY: -1, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);

        // tslint:disable-next-line:no-magic-numbers
        const imageData = baseCtxStub.getImageData(1, 1, 25, 25);
        expect(imageData.data[ALPHA]).toEqual(0); // A
    });
});
