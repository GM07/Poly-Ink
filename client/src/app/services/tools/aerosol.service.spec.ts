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
    let drawSpraySpy: jasmine.Spy<any>;
    let sprayContinuouslySpy: jasmine.Spy<any>;
    let onMouseDownSpy: jasmine.Spy<any>;

    const ALPHA = 3;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
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
        drawSpraySpy = spyOn<any>(service, 'drawSpray').and.callThrough();
        sprayContinuouslySpy = spyOn<any>(service, 'sprayContinuously').and.callThrough();
        onMouseDownSpy = spyOn<any>(service, 'onMouseDown').and.callThrough();

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
        window.clearInterval(service.sprayIntervalID);
    });

    it('mouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            clientX: 25,
            clientY: 25,
            button: 1,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.leftMouseDown).toEqual(false);
        window.clearInterval(service.sprayIntervalID);
    });

    it('onMouseUp should not call drawSpray if mouse was not already down', () => {
        service.leftMouseDown = false;
        service.mouseDownCoord = { x: 0, y: 0 };

        service.onMouseUp();
        expect(drawSpraySpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call sprayContinuouslySpy if mouse was already down', () => {
        const expectedResult: Vec2 = { x: 25, y: 25 };
        service.leftMouseDown = true;
        service.onMouseMove(mouseEvent);
        expect(service.mousePosition).toEqual(expectedResult);
        window.clearInterval(service.sprayIntervalID);
    });

    it('should not spray between the points where it left and entered the canvas', () => {
        service.areaDiameter = 2;
        let mouseEventLClick: MouseEvent = { clientX: 0, clientY: 0, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseDown(mouseEventLClick);
        service.onMouseLeave();
        mouseEventLClick = { clientX: 0, clientY: 50, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseEnter(mouseEventLClick);
        expect(sprayContinuouslySpy).toHaveBeenCalled();
        service.onMouseUp();

        // tslint:disable-next-line:no-magic-numbers
        const imageData: ImageData = previewCtxStub.getImageData(2, 2, 25, 25);
        expect(imageData.data[ALPHA]).toEqual(0); // A, rien ne doit être dessiné
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
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        const imageData: ImageData = baseCtxStub.getImageData(0, 1, 1, 1);
        expect(imageData.data[ALPHA]).toEqual(0); // A, rien ne doit être dessiné où on est entré

        service.leftMouseDown = true;
        service.onMouseUp();
        expect(sprayContinuouslySpy).toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('should call onMousDown when entering the canvas if mouse is down', () => {
        mouseEvent = { clientX: 0, clientY: 0, button: 0, buttons: 1 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(onMouseDownSpy).toHaveBeenCalled();
    });

    it('should do nothing when entering the canvas, with an unsupported mouse state', () => {
        mouseEvent = { clientX: 0, clientY: 0, button: 0, buttons: 3 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(drawSpraySpy).not.toHaveBeenCalled();
        expect(drawServiceSpy.clearCanvas).not.toHaveBeenCalled();
        mouseEvent = { clientX: 0, clientY: 0, button: 10, buttons: 3 } as MouseEvent;
        service.onMouseEnter(mouseEvent);
        expect(drawSpraySpy).not.toHaveBeenCalled();
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
        const imageData: ImageData = baseCtxStub.getImageData(0, 0, 1, 1);
        expect(imageData.data[ALPHA]).toEqual(0);
        window.clearInterval(service.sprayIntervalID);
    });

    it('should stop drawing when asked to', () => {
        service.stopDrawing();
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });
});
