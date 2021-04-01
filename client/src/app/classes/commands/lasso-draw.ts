import { LineDrawer } from '@app/classes/line-drawer';
import { SelectionData } from '@app/classes/selection/selection-data';
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
        if (!this.config.isInSelection) {
            LineDrawer.drawDashedLinePath(
                context,
                this.config.points,
                new Vec2(0, 0),
                this.config.intersecting ? ['red', 'white'] : ['black', 'white'],
            );
            return;
        }

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
        context.fillStyle = 'white';
        LineDrawer.drawFilledLinePath(context, this.config.points);
    }
}
