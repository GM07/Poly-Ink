import { LineDrawer } from '@app/classes/line-drawer';
import { LassoConfig } from '@app/classes/tool-config/lasso-config';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { AbstractDraw } from './abstract-draw';

export class LassoDraw extends AbstractDraw {
    private config: LassoConfig;

    static drawClippedSelection(ctx: CanvasRenderingContext2D, configLasso: LassoConfig): void {
        ctx.beginPath();
        ctx.save();
        LineDrawer.drawClippedLinePath(ctx, configLasso.points);
        ctx.drawImage(
            configLasso.SELECTION_DATA,
            configLasso.endCoords.x,
            configLasso.endCoords.y,
            Math.abs(configLasso.width),
            Math.abs(configLasso.height),
        );
        ctx.restore();
        ctx.closePath();
    }

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

        if (!this.config.markedForPaste) {
            this.fillBackground(context);
        }

        if (!this.config.markedForDelete) {
            LassoDraw.drawClippedSelection(context, this.config);
        }
    }

    private fillBackground(context: CanvasRenderingContext2D): void {
        if (!this.config.didChange()) return;
        context.fillStyle = 'white';
        LineDrawer.drawFilledLinePath(context, this.config.originalPoints);
    }
}
