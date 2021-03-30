import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { ColorService } from 'src/color-picker/services/color.service';
import { AbstractSelectionDraw } from './abstract-selection-draw';

export class RectangleSelectionDraw extends AbstractDraw {
    private config: SelectionConfig;

    constructor(colorService: ColorService, config: SelectionConfig) {
        super(colorService);
        this.config = config.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        const selectionCanvas = AbstractSelectionDraw.saveSelectionToCanvas(context, this.config);

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
}
