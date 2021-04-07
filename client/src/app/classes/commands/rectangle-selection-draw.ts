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
        if (!this.config.markedForPaste) {
            this.fillBackground(context);
        }

        if (!this.config.markedForDelete) {
            RectangleSelectionDraw.drawClippedSelection(context, this.config);
        }
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

    static drawClippedSelection(ctx: CanvasRenderingContext2D, config: SelectionConfig): void {
        ctx.drawImage(config.SELECTION_DATA, config.endCoords.x, config.endCoords.y, Math.abs(config.width), Math.abs(config.height));
    }
}
