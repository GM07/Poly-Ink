import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
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

        context.drawImage(selectionCanvas, this.config.endCoords.x, this.config.endCoords.y);
    }

    private fillBackground(context: CanvasRenderingContext2D): void {
        if (this.config.startCoords.x === this.config.endCoords.x && this.config.startCoords.y === this.config.endCoords.y) return;
        context.beginPath();
        context.fillStyle = 'white';
        context.fillRect(this.config.startCoords.x, this.config.startCoords.y, Math.abs(this.config.width), Math.abs(this.config.height));
        context.closePath();
    }

    private saveSelectionToCanvas(context: CanvasRenderingContext2D): HTMLCanvasElement {
        const imageData = context.getImageData(
            this.config.startCoords.x,
            this.config.startCoords.y,
            Math.abs(this.config.width),
            Math.abs(this.config.height),
        );

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
        tempCanvas.width = Math.abs(this.config.width);
        tempCanvas.height = Math.abs(this.config.height);
        tempCtx.putImageData(imageData, 0, 0);

        this.fillBackground(context);

        return tempCanvas;
    }
}
