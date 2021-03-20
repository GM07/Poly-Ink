import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { ColorService } from 'src/color-picker/services/color.service';

export class EllipseSelectionDraw extends AbstractDraw {
    private config: SelectionConfig;

    constructor(colorService: ColorService, config: SelectionConfig) {
        super(colorService);
        this.config = config.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        const radiusX = Math.abs(this.config.width / 2);
        const radiusY = Math.abs(this.config.height / 2);

        const centerX = this.config.endCoords.x + Math.abs(this.config.width / 2);
        const centerY = this.config.endCoords.y + Math.abs(this.config.height / 2);

        const selectionCanvas = this.saveSelectionToCanvas(context);

        this.fillBackground(context);

        context.beginPath();
        context.save();
        context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        context.clip();
        context.drawImage(selectionCanvas, this.config.endCoords.x, this.config.endCoords.y);
        context.restore();
        context.closePath();
    }

    private fillBackground(context: CanvasRenderingContext2D): void {
        if (this.config.startCoords.x === this.config.endCoords.x && this.config.startCoords.y === this.config.endCoords.y) return;
        const radiusX = Math.abs(this.config.width / 2);
        const radiusY = Math.abs(this.config.height / 2);
        const centerX = this.config.startCoords.x + Math.abs(this.config.width / 2);
        const centerY = this.config.startCoords.y + Math.abs(this.config.height / 2);
        context.beginPath();
        context.fillStyle = 'white';
        context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
        context.fill();
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

        return tempCanvas;
    }
}
