import { AbstractSelectionDraw } from '@app/classes/commands/abstract-selection-draw';
import { LassoConfig } from '@app/classes/tool-config/lasso-config';
import { ColorService } from 'src/color-picker/services/color.service';
import { LineDrawer } from '../line-drawer';
import { AbstractDraw } from './abstract-draw';

export class LassoDraw extends AbstractDraw {
    private config: LassoConfig;
    constructor(colorService: ColorService, config: LassoConfig) {
        super(colorService);
        this.config = config.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        if (!this.config.inSelection) {
            LineDrawer.drawDashedLinePath(context, this.config.points);
            return;
        }

        const selectionCanvas = AbstractSelectionDraw.saveSelectionToCanvas(context, this.config);
        this.fillBackground(context);

        context.beginPath();
        context.save();

        const dp = this.config.endCoords.substract(this.config.startCoords);
        LineDrawer.drawClippedLinePath(context, this.config.points, dp);

        context.drawImage(selectionCanvas, this.config.endCoords.x, this.config.endCoords.y);
        context.restore();
    }

    private fillBackground(context: CanvasRenderingContext2D): void {
        context.fillStyle = 'white';
        LineDrawer.drawFilledLinePath(context, this.config.points);
    }
}
