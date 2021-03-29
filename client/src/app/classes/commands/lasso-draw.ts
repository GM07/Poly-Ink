import { LassoConfig } from '@app/classes/tool-config/lasso-config';
import { ColorService } from 'src/color-picker/services/color.service';
import { AbstractDraw } from './abstract-draw';

export class LassoDraw extends AbstractDraw {
    private config: LassoConfig;
    constructor(colorService: ColorService, lineConfig: LassoConfig) {
        super(colorService);
        this.config = lineConfig.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        this.applyAttributes(context);
        this.drawLinePath(context);
    }

    private applyAttributes(ctx: CanvasRenderingContext2D): void {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 15]);
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;
    }

    private drawLinePath(ctx: CanvasRenderingContext2D): void {
        if (this.config.points.length === 0) return;

        ctx.beginPath();
        ctx.moveTo(this.config.points[0].x, this.config.points[0].y);
        for (let index = 1; index < this.config.points.length; index++) {
            const point = this.config.points[index];
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        ctx.closePath();
    }
}
