import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AerosolService } from '@app/services/tools/aerosol.service';
import { ColorService } from 'src/color-picker/services/color.service';

// tslint:disable:no-any
describe('AerosolService', () => {
    const MS_PER_SECOND = 1000;
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

        sprayContinuouslySpy = spyOn<any>(service, 'sprayContinuously');

        // service's spy configuration
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        mouseEvent = {
            clientX: 25,
            clientY: 25,
            button: 0,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('mouseDown should set mouseDown property to true on left click', () => {
        service.onMouseDown(mouseEvent);
        expect(service.leftMouseDown).toEqual(true);
    });

    it('mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            clientX: 25,
            clientY: 25,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.leftMouseDown).toEqual(false);
    });

    it('onMouseUp should not call drawSpray if mouse was not already down', () => {
        service.leftMouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp();
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should set the mouse down coordinates', () => {
        const expectedResult = { x: 25, y: 25 };
        service.leftMouseDown = true;
        service.onMouseMove(mouseEvent);
        expect(service.mouseDownCoord).toEqual(expectedResult);
    });

    it('should not spray between the points where it left and entered the canvas', () => {
        service.areaDiameter = 2;
        let mouseEventLClick: MouseEvent = { clientX: 0, clientY: 0, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseDown(mouseEventLClick);
        service.onMouseLeave();
        mouseEventLClick = { clientX: 0, clientY: 50, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseEnter(mouseEventLClick);
        mouseEventLClick = { x: 0, y: 50, button: 0 } as MouseEvent;
        service.onMouseUp();
        expect(sprayContinuouslySpy).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
    });

    it('should stop drawing when the mouse is up', () => {
        let mouseEventLClick: MouseEvent = { clientX: 0, clientY: 0, button: 0, buttons: 1 } as MouseEvent;
        service.areaDiameter = 1;
        service.onMouseDown(mouseEventLClick);
        service.onMouseLeave();
        mouseEventLClick = { clientX: 0, clientY: 2, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseUp();
        service.onMouseEnter(mouseEventLClick);
        expect(sprayContinuouslySpy).toHaveBeenCalled();
        expect(drawSpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should call sprayContinuously when entering the canvas if mouse is down', () => {
        mouseEvent = { clientX: 0, clientY: 0, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(sprayContinuouslySpy).toHaveBeenCalled();
    });

    it('should do nothing when entering the canvas, with an unsupported mouse state', () => {
        mouseEvent = { clientX: 0, clientY: 0, button: 0, buttons: 3 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        mouseEvent = { clientX: 0, clientY: 0, button: 10, buttons: 3 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('should clear the canvas preview when the mouse leaves the canvas, left click released', () => {
        mouseEvent = { clientX: 0, clientY: 0, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseLeave();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should only draw nothing on base canvas when moving the mouse, left click released', () => {
        service.leftMouseDown = false;
        mouseEvent = { clientX: 0, clientY: 0, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseMove(mouseEvent);
        expect(drawPreviewSpy).not.toHaveBeenCalled();
    });

    it('should stop drawing when asked to', () => {
        service.stopDrawing();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should draw on mouseup if mouse was down', () => {
        service.leftMouseDown = true;
        mouseEvent = { x: 0, y: 0, button: 0, buttons: 0 } as MouseEvent;
        service.onMouseUp();
        expect(drawSpy).toHaveBeenCalled();
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

    it('should spray continuoulsy', () => {
        jasmine.clock().install();
        const placeSpy = spyOn<any>(service, 'placePoints');
        sprayContinuouslySpy.and.callThrough();
        service['sprayContinuously']();
        jasmine.clock().tick((MS_PER_SECOND / service['emissionsPerSecondIn']) * 2);
        jasmine.clock().uninstall();
        expect(placeSpy).toHaveBeenCalled();
        expect(drawPreviewSpy).toHaveBeenCalled();
        window.clearInterval(service.sprayIntervalID);
    });

    it('should add seeds and mousePosition to config when placing points', () => {
        service.mouseDownCoord = { x: 0, y: 0 };
        expect(service.config.points.length).toEqual(0);
        service['placePoints']();
        expect(service.config.points.length).not.toEqual(0);
    });
});
