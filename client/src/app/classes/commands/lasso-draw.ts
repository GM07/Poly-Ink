import { AbstractSelectionDraw } from '@app/classes/commands/abstract-selection-draw';
import { LineDrawer } from '@app/classes/line-drawer';
import { LassoConfig } from '@app/classes/tool-config/lasso-config';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from 'src/color-picker/services/color.service';
import { AbstractDraw } from './abstract-draw';

export class LassoDraw extends AbstractDraw {
    private config: LassoConfig;
    constructor(colorService: ColorService, config: LassoConfig) {
        super(colorService);
        this.config = config.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        if (!this.config.inSelection) {
            LineDrawer.drawDashedLinePath(
                context,
                this.config.points,
                new Vec2(0, 0),
                this.config.intersecting ? ['red', 'white'] : ['black', 'white'],
            );
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
