import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { NewDrawing } from './new-drawing';

describe('NewDrawing', () => {
    let service: NewDrawing;
    let drawingService: DrawingService;
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    let toolHandler: ToolHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        drawingService = TestBed.inject(DrawingService);
        toolHandler = TestBed.inject(ToolHandlerService);
        service = new NewDrawing(drawingService, toolHandler);
        canvas = document.createElement('canvas');
        context = canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingService.canvas = canvas;
        canvas.width = 1;
        canvas.height = 1;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return true if not white', () => {
        // tslint:disable:no-string-literal
        context.fillStyle = 'grey';
        context.fillRect(0, 0, canvas.width, canvas.height);
        const returnValue = NewDrawing.isNotEmpty(context, canvas.width, canvas.height);
        expect(returnValue).toBe(true);
    });

    it('should return false if white', () => {
        // tslint:disable:no-string-literal
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        const returnValue = NewDrawing.isNotEmpty(context, canvas.width, canvas.height);
        expect(returnValue).toBe(false);
    });

    it('should reset if confirm is true', () => {
        const spyFunc = spyOn(drawingService, 'resizeCanvas');
        const spyFunc2 = spyOn(drawingService, 'initBackground');
        spyOn(toolHandler.getTool(), 'stopDrawing').and.callFake(() => {
            /**/
        });
        service.newCanvas(true);
        expect(spyFunc).toHaveBeenCalled();
        expect(spyFunc2).toHaveBeenCalled();
    });

    it('should not reset if confirm is false and not empty', () => {
        // tslint:disable no-any
        const spyFunc = spyOn<any>(NewDrawing, 'isNotEmpty').and.returnValue(true);
        const spyFunc2 = spyOn(drawingService, 'resizeCanvas');
        spyOn(toolHandler.getTool(), 'stopDrawing').and.callFake(() => {
            /**/
        });
        service.newCanvas(false);
        expect(spyFunc).toHaveBeenCalled();
        expect(spyFunc2).not.toHaveBeenCalled();
    });

    it('should reset if confirm is false and empty', () => {
        drawingService.baseCtx = context;
        const spyFunc = spyOn(drawingService, 'resizeCanvas');
        const spyFunc2 = spyOn<any>(NewDrawing, 'isNotEmpty').and.returnValue(false);
        spyOn(toolHandler.getTool(), 'stopDrawing').and.callFake(() => {
            /**/
        });
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        service.newCanvas(false);
        expect(spyFunc).toHaveBeenCalled();
        expect(spyFunc2).toHaveBeenCalled();
    });
});
