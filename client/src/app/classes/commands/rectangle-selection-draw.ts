import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';

export class RectangleSelectionDraw extends AbstractDraw {
    private config: SelectionConfig;

    constructor(colorService: ColorService, config: SelectionConfig) {
        super(colorService);
        this.config = config.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        const selectionCanvas = this.saveSelectionToCanvas(context);

        this.fillBackground(context);

        context.drawImage(selectionCanvas, Math.floor(this.config.endCoords.x), Math.floor(this.config.endCoords.y));
    }

    private fillBackground(context: CanvasRenderingContext2D): void {
        if (!this.config.didChange()) return;

        context.beginPath();
        context.fillStyle = 'white';
        context.fillRect(
            this.config.startCoords.x,
            this.config.startCoords.y,
            Math.abs(this.config.originalWidth),
            Math.abs(this.config.originalHeight),
        );
        context.closePath();
    }

    private saveSelectionToCanvas(context: CanvasRenderingContext2D): HTMLCanvasElement {
        const imageData = context.getImageData(
            this.config.startCoords.x,
            this.config.startCoords.y,
            Math.abs(this.config.originalWidth),
            Math.abs(this.config.originalHeight),
        );

        const returnedCanvas = document.createElement('canvas');
        const returnedCtx = returnedCanvas.getContext('2d') as CanvasRenderingContext2D;

        returnedCanvas.width = Math.abs(this.config.originalWidth);
        returnedCanvas.height = Math.abs(this.config.originalHeight);
        returnedCtx.putImageData(imageData, 0, 0);

        const memoryCanvas = document.createElement('canvas');
        DrawingService.saveCanvas(memoryCanvas, returnedCanvas);
        returnedCanvas.width = Math.abs(this.config.width);
        returnedCanvas.height = Math.abs(this.config.height);
        returnedCtx.save();
        returnedCtx.scale(this.config.scaleFactor.x, this.config.scaleFactor.y);
        returnedCtx.drawImage(
            memoryCanvas,
            this.config.scaleFactor.x < 0 ? -Math.abs(this.config.width) : 0,
            this.config.scaleFactor.y < 0 ? -Math.abs(this.config.height) : 0,
            Math.abs(this.config.width),
            Math.abs(this.config.height),
        );
        returnedCtx.restore();

        return returnedCanvas;
    }
}
