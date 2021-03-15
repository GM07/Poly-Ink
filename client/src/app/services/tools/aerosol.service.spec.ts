import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AerosolService } from '@app/services/tools/aerosol.service';
import { ColorService } from 'src/color-picker/services/color.service';

// tslint:disable:no-any
describe('AerosolService', () => {
    let service: AerosolService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawSpy: jasmine.Spy<any>;
    let drawPreviewSpy: jasmine.Spy<any>;
    let sprayContinuouslySpy: jasmine.Spy<any>;
    let onMouseDownSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'draw', 'drawPreview']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', [], { primaryRgba: 'rgba(0, 0, 0, 1)' });

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorService, useValue: colorServiceSpy },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(AerosolService);
        drawSpy = spyOn<any>(service, 'draw').and.stub();
        drawPreviewSpy = spyOn<any>(service, 'drawPreview').and.stub();

        sprayContinuouslySpy = spyOn<any>(service, 'sprayContinuously').and.callThrough();
        onMouseDownSpy = spyOn<any>(service, 'onMouseDown').and.callThrough();

        // Configuration du spy du service
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        mouseEvent = {
            pageX: 25,
            pageY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.leftMouseDown).toEqual(true);
        window.clearInterval(service.sprayIntervalID);
    });

    it('mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            pageX: 25,
            pageY: 25,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.leftMouseDown).toEqual(false);
        window.clearInterval(service.sprayIntervalID);
    });

    it('onMouseUp should not call drawSpray if mouse was not already down', () => {
        service.leftMouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp(mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call sprayContinuouslySpy if mouse was already down', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.leftMouseDown = true;
        service.onMouseMove(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
        window.clearInterval(service.sprayIntervalID);
    });

    it('should not spray between the points where it left and entered the canvas', () => {
        service.areaDiameter = 2;
        let mouseEventLClick: MouseEvent = { pageX: 0, pageY: 0, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseDown(mouseEventLClick);
        service.onMouseLeave(mouseEventLClick);
        mouseEventLClick = { pageX: 0, pageY: 50, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseEnter(mouseEventLClick);
        mouseEventLClick = { pageX: 0, pageY: 50, button: 0 } as MouseEvent;
        service.onMouseUp(mouseEventLClick);
        expect(sprayContinuouslySpy).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
    });

    it('should stop drawing when the mouse is up', () => {
        let mouseEventLClick: MouseEvent = { pageX: 0, pageY: 0, button: 0, buttons: 1 } as MouseEvent;
        service.areaDiameter = 1;
        service.onMouseDown(mouseEventLClick);
        service.onMouseLeave(mouseEventLClick);
        mouseEventLClick = { pageX: 0, pageY: 2, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseUp(mouseEventLClick);
        service.onMouseEnter(mouseEventLClick);
        expect(sprayContinuouslySpy).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should call onMousDown when entering the canvas if mouse is down', () => {
        mouseEvent = { pageX: 0, pageY: 0, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(onMouseDownSpy).toHaveBeenCalled();
    });

    it('should do nothing when entering the canvas, with an unsupported mouse state', () => {
        mouseEvent = { pageX: 0, pageY: 0, button: 0, buttons: 3 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        mouseEvent = { pageX: 0, pageY: 0, button: 10, buttons: 3 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('should clear the canvas preview when the mouse leaves the canvas, left click released', () => {
        mouseEvent = { pageX: 0, pageY: 0, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseLeave(mouseEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should only draw nothing on base canvas when moving the mouse, left click released', () => {
        service.leftMouseDown = false;
        mouseEvent = { pageX: 0, pageY: 0, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        window.clearInterval(service.sprayIntervalID);
    });

    it('should stop drawing when asked to', () => {
        service.stopDrawing();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should draw on mouseup if mouse was down', () => {
        service.leftMouseDown = true;
        mouseEvent = { pageX: 0, pageY: 0, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseUp(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
        window.clearInterval(service.sprayIntervalID);
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
});
