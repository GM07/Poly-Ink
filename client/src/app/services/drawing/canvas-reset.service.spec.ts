import { TestBed } from '@angular/core/testing';
import { ToolHandlerService } from '@app/services/tools/tool-handler.service';
import { NewDrawingService } from './canvas-reset.service';
import { DrawingService } from './drawing.service';

describe('NewDrawingService', () => {
    let service: NewDrawingService;
    let drawingService: DrawingService;
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;
    let toolHandler: ToolHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NewDrawingService);
        drawingService = TestBed.inject(DrawingService);
        toolHandler = TestBed.inject(ToolHandlerService);
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
        const returnValue = service['isNotEmpty'](context, canvas.width, canvas.height);
        expect(returnValue).toBe(true);
    });

    it('should return false if white', () => {
        // tslint:disable:no-string-literal
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        const returnValue = service['isNotEmpty'](context, canvas.width, canvas.height);
        expect(returnValue).toBe(false);
    });

    it('should reset if confirm is true', () => {
        const spyFunc = spyOn(drawingService, 'resizeCanvas');
        const spyFunc2 = spyOn(drawingService, 'initBackground');
        spyOn(toolHandler.getCurrentTool(), 'stopDrawing').and.callFake(() => {
            /**/
        });
        service.newCanvas(true);
        expect(spyFunc).toHaveBeenCalled();
        expect(spyFunc2).toHaveBeenCalled();
    });

    it('should not reset if confirm is false and not empty', () => {
        // tslint:disable no-any
        const spyFunc = spyOn<any>(service, 'isNotEmpty').and.returnValue(true);
        const spyFunc2 = spyOn(drawingService, 'resizeCanvas');
        spyOn(toolHandler.getCurrentTool(), 'stopDrawing').and.callFake(() => {
            /**/
        });
        service.newCanvas(false);
        expect(spyFunc).toHaveBeenCalled();
        expect(spyFunc2).not.toHaveBeenCalled();
    });

    it('should reset if confirm is false and empty', () => {
        drawingService.baseCtx = context;
        const spyFunc = spyOn(drawingService, 'resizeCanvas');
        const spyFunc2 = spyOn<any>(service, 'isNotEmpty').and.returnValue(false);
        spyOn(toolHandler.getCurrentTool(), 'stopDrawing').and.callFake(() => {
            /**/
        });
        context.fillStyle = 'white';
        context.fillRect(0, 0, canvas.width, canvas.height);
        service.newCanvas(false);
        expect(spyFunc).toHaveBeenCalled();
        expect(spyFunc2).toHaveBeenCalled();
    });
});
