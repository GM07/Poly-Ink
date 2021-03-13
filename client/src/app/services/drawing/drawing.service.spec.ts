import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { PencilDraw } from '@app/classes/commands/pencil-draw';
import { PencilConfig } from '@app/classes/tool-config/pencil-settings';
import { ColorService } from 'src/color-picker/services/color.service';
import { DrawingService } from './drawing.service';

describe('DrawingService', () => {
    let service: DrawingService;
    let canvasTestHelper: CanvasTestHelper;
    let command: AbstractDraw;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DrawingService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        service.canvas = canvasTestHelper.canvas;
        service.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        service.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        command = new PencilDraw({} as ColorService, {} as PencilConfig);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should clear the whole canvas', () => {
        service.clearCanvas(service.baseCtx);
        const pixelBuffer = new Uint32Array(service.baseCtx.getImageData(0, 0, service.canvas.width, service.canvas.height).data.buffer);
        const hasColoredPixels = pixelBuffer.some((color) => color !== 0);
        expect(hasColoredPixels).toEqual(false);
    });

    it('draw should execute command on base canvas', () => {
        spyOn(command, 'execute').and.stub();
        service.draw(command);
        expect(command.execute).toHaveBeenCalledWith(service.baseCtx);
    });

    it('drawPreview should clear preview', () => {
        spyOn(command, 'execute').and.stub();
        spyOn(service, 'clearCanvas').and.stub();
        service.drawPreview(command);
        expect(service.clearCanvas).toHaveBeenCalled();
    });

    it('drawPreview should execute command on preview', () => {
        spyOn(command, 'execute').and.stub();
        spyOn(service, 'clearCanvas').and.stub();
        service.drawPreview(command);
        expect(command.execute).toHaveBeenCalledWith(service.previewCtx);
    });
});
