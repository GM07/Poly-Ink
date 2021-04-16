import { LineConfig } from '@app/classes/tool-config/line-config';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { AbstractDraw } from './abstract-draw';

export class LineDraw extends AbstractDraw {
    private config: LineConfig;
    constructor(colorService: ColorService, lineConfig: LineConfig) {
        super(colorService);
        this.config = lineConfig.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        this.applyAttributes(context);
        this.drawLinePath(context);
    }

    private applyAttributes(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.primaryRgba;
        ctx.strokeStyle = this.primaryRgba;
        ctx.lineWidth = this.config.thickness;
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;
    }

    private drawJunction(ctx: CanvasRenderingContext2D, point: Vec2): void {
        if (this.config.showJunctionPoints) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, this.config.diameterJunctions / 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    private drawLinePath(ctx: CanvasRenderingContext2D): void {
        this.drawJunction(ctx, this.config.points[0]);

        ctx.beginPath();
        ctx.moveTo(this.config.points[0].x, this.config.points[0].y);
        for (let index = 1; index < this.config.points.length; index++) {
            const point = this.config.points[index];
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        ctx.closePath();

        for (let index = 1; index < (this.config.closedLoop ? this.config.points.length - 1 : this.config.points.length); index++) {
            const point = this.config.points[index];

            this.drawJunction(ctx, point);
        }
    }
}
