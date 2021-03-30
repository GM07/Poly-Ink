import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { DrawingService } from '@app/services/drawing/drawing.service';

export class AbstractSelectionDraw {
    static saveSelectionToCanvas(context: CanvasRenderingContext2D, config: SelectionConfig): HTMLCanvasElement {
        const imageData = context.getImageData(
            config.startCoords.x,
            config.startCoords.y,
            Math.abs(config.originalWidth),
            Math.abs(config.originalHeight),
        );

        const returnedCanvas = document.createElement('canvas');
        const returnedCtx = returnedCanvas.getContext('2d') as CanvasRenderingContext2D;

        returnedCanvas.width = Math.abs(config.originalWidth);
        returnedCanvas.height = Math.abs(config.originalHeight);
        returnedCtx.putImageData(imageData, 0, 0);

        const memoryCanvas = document.createElement('canvas');
        DrawingService.saveCanvas(memoryCanvas, returnedCanvas);
        returnedCanvas.width = Math.abs(config.width);
        returnedCanvas.height = Math.abs(config.height);
        returnedCtx.save();
        returnedCtx.scale(config.scaleFactor.x, config.scaleFactor.y);
        returnedCtx.drawImage(
            memoryCanvas,
            config.scaleFactor.x < 0 ? -Math.abs(config.width) : 0,
            config.scaleFactor.y < 0 ? -Math.abs(config.height) : 0,
            Math.abs(config.width),
            Math.abs(config.height),
        );
        returnedCtx.restore();

        return returnedCanvas;
    }
}
