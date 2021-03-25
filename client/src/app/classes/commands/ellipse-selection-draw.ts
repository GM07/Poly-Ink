import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from 'src/color-picker/services/color.service';

export class EllipseSelectionDraw extends AbstractDraw {
    private config: SelectionConfig;

    constructor(colorService: ColorService, config: SelectionConfig) {
        super(colorService);
        this.config = config.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        const radius = new Vec2(this.config.width / 2, this.config.height / 2).apply(Math.abs);
        const center = this.config.endCoords.add(radius);

        const selectionCanvas = this.saveSelectionToCanvas(context);

        this.fillBackground(context);

        context.beginPath();
        context.save();
        context.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
        context.clip();
        context.drawImage(selectionCanvas, Math.floor(this.config.endCoords.x), Math.floor(this.config.endCoords.y));
        context.restore();
        context.closePath();
    }

    private fillBackground(context: CanvasRenderingContext2D): void {
        if (this.config.startCoords.equals(this.config.endCoords)) return;
        const radius = new Vec2(this.config.width / 2, this.config.height / 2).apply(Math.abs);
        const center = this.config.startCoords.add(radius);
        context.beginPath();
        context.fillStyle = 'white';
        context.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
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
