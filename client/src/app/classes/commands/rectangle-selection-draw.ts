import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { SelectionData } from '@app/classes/selection/selection-data';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { ColorService } from 'src/color-picker/services/color.service';

export class RectangleSelectionDraw extends AbstractDraw {
    private config: SelectionConfig;

    constructor(colorService: ColorService, config: SelectionConfig) {
        super(colorService);
        this.config = config.clone();
    }

    execute(context: CanvasRenderingContext2D): void {

        this.fillBackground(context);

        context.drawImage(
            this.config.SELECTION_DATA[SelectionData.FinalData],
            Math.floor(this.config.endCoords.x),
            Math.floor(this.config.endCoords.y),
            Math.abs(this.config.width),
            Math.abs(this.config.height),
        );
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
