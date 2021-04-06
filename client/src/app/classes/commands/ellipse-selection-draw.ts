import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { SelectionData } from '@app/classes/selection/selection-data';
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
        if (!this.config.markedForPaste) {
            this.fillBackground(context);
        }

        if (!this.config.markedForDelete) {
            context.drawImage(
                this.config.SELECTION_DATA[SelectionData.FinalData],
                Math.floor(this.config.endCoords.x),
                Math.floor(this.config.endCoords.y),
                Math.abs(this.config.width),
                Math.abs(this.config.height),
            );
        }
    }

    private fillBackground(context: CanvasRenderingContext2D): void {
        if (!this.config.didChange()) return;

        const radius = new Vec2(this.config.originalWidth / 2, this.config.originalHeight / 2).apply(Math.abs);
        const center = this.config.startCoords.add(radius);
        context.beginPath();
        context.fillStyle = 'white';
        context.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }
}
