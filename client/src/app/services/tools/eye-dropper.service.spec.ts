import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Color } from 'src/color-picker/classes/color';
import { ColorService } from 'src/color-picker/services/color.service';
import { EyeDropperService } from './eye-dropper.service';

/* tslint:disable:no-magic-numbers */
/* tslint:disable:no-string-literal */
/* tslint:disable:no-any */

describe('EyeDropperService', () => {
    let service: EyeDropperService;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let canvasTestHelper: CanvasTestHelper;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

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
        service = TestBed.inject(EyeDropperService);

        // service's spy configuration
        // tslint:disable:no-string-literal
        service['drawingService'].baseCtx = baseCtxStub; // Jasmine doesnt copy properties with underlying data
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should do nothing if not in canvas', () => {
        spyOn(service, 'isInCanvas').and.returnValue(false);
        spyOn(service, 'getPositionFromMouse');
        service.onMouseDown({} as MouseEvent);
        expect(service.getPositionFromMouse).not.toHaveBeenCalled();
    });

    it('onMouseDown should set Primary color on left click', () => {
        spyOn(service, 'isInCanvas').and.returnValue(true);
        drawServiceSpy.canvas.width = 10;
        drawServiceSpy.canvas.height = 10;
        drawServiceSpy.baseCtx.fillStyle = 'black';
        drawServiceSpy.baseCtx.fillRect(0, 0, 10, 10);
        const mouseEvent = { offsetX: 0, offsetY: 0, button: 0 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service['colorService'].primaryColor).toEqual(new Color(0, 0, 0));
    });

    it('onMouseDown should set secondary color on right click', () => {
        spyOn(service, 'isInCanvas').and.returnValue(true);
        drawServiceSpy.canvas.width = 10;
        drawServiceSpy.canvas.height = 10;
        drawServiceSpy.baseCtx.fillStyle = 'black';
        drawServiceSpy.baseCtx.fillRect(0, 0, 10, 10);
        const mouseEvent = { offsetX: 0, offsetY: 0, button: 2 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service['colorService'].secondaryColor).toEqual(new Color(0, 0, 0));
    });

    it('onMouseDown should do nothing on other click', () => {
        service['colorService'].secondaryColor = new Color(25, 25, 25);
        service['colorService'].primaryColor = new Color(25, 25, 25);
        spyOn(service, 'isInCanvas').and.returnValue(true);
        drawServiceSpy.canvas.width = 10;
        drawServiceSpy.canvas.height = 10;
        drawServiceSpy.baseCtx.fillStyle = 'black';
        drawServiceSpy.baseCtx.fillRect(0, 0, 10, 10);
        const mouseEvent = { offsetX: 0, offsetY: 0, button: 1 } as MouseEvent;
        service.onMouseDown(mouseEvent);
        expect(service['colorService'].secondaryColor).toEqual(new Color(25, 25, 25));
        expect(service['colorService'].primaryColor).toEqual(new Color(25, 25, 25));
    });

    it('onMouseMove should do nothing if the previsualisation has not been detected', () => {
        spyOn(service, 'isInCanvas');
        service.onMouseMove({} as MouseEvent);
        expect(service.isInCanvas).not.toHaveBeenCalled();
    });

    it('onMouseMove should clear the previsualisation if outside of the canvas', () => {
        service['previsualisationCanvas'] = document.createElement('canvas');
        service['previsualisationCtx'] = service['previsualisationCanvas'].getContext('2d') as CanvasRenderingContext2D;
        spyOn(service.previsualisationCtx, 'clearRect');
        spyOn<any>(service, 'getPrevisualisation');
        spyOn(service, 'isInCanvas').and.returnValue(false);
        service.onMouseMove({} as MouseEvent);
        expect(service.previsualisationCtx.clearRect).toHaveBeenCalled();
    });

    it('onMouseMove should draw the image if  inside the canvas', () => {
        service['previsualisationCanvas'] = document.createElement('canvas');
        service['previsualisationCtx'] = service['previsualisationCanvas'].getContext('2d') as CanvasRenderingContext2D;
        spyOn(service.previsualisationCtx, 'drawImage');
        spyOn<any>(service, 'drawSelectedPixelRect');
        spyOn<any>(service, 'getPrevisualisation');
        spyOn(service, 'isInCanvas').and.returnValue(true);
        service.onMouseMove({} as MouseEvent);
        expect(service.previsualisationCtx.drawImage).toHaveBeenCalled();
    });

    it('drawSelectedPixelRect should draw a dotted rectangle at the center of the previsualisation', () => {
        spyOn(service['drawingService'].baseCtx, 'strokeRect');
        service['drawSelectedPixelRect'](service['drawingService'].baseCtx, canvasTestHelper.canvas, 10);
        expect(service['drawingService'].baseCtx.strokeRect).toHaveBeenCalledTimes(2);
    });

    it('getPrevisualisation should return a previsualisation of the current location', () => {
        service['drawingService'].canvas.width = 5;
        service['drawingService'].canvas.height = 5;
        service['drawingService'].baseCtx.fillStyle = 'black';
        service['drawingService'].baseCtx.fillRect(0, 0, 5, 5);
        expect(
            (service['getPrevisualisation']({ x: 1, y: 1 } as Vec2, 1).getContext(
                '2d',
            ) as CanvasRenderingContext2D).getImageData(1, 1, 1, 1).data[0],
        ).toEqual(0);
    });

    it('stop drawing should do nothing', () => {
        const eyeDropper: EyeDropperService = service;
        service.stopDrawing();
        expect(service).toEqual(eyeDropper);
    });
});
