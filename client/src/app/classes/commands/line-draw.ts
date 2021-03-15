import { LineConfig } from '@app/classes/tool-config/line-config.ts';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from 'src/color-picker/services/color.service';
import { AbstractDraw } from './abstract-draw';

export class LineDraw extends AbstractDraw {
    lineConfig: LineConfig;
    constructor(colorService: ColorService, lineConfig: LineConfig) {
        super(colorService);
        this.lineConfig = lineConfig.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        this.applyAttributes(context);
        this.drawLinePath(context);
    }

    private applyAttributes(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = this.primaryRgba;
        ctx.strokeStyle = this.primaryRgba;
        ctx.lineWidth = this.lineConfig.thickness;
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;
    }

    private drawJunction(ctx: CanvasRenderingContext2D, point: Vec2): void {
        if (this.lineConfig.showJunctionPoints) {
            ctx.beginPath();
            ctx.arc(point.x, point.y, this.lineConfig.diameterJunctions / 2, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    private drawLinePath(ctx: CanvasRenderingContext2D): void {
        this.drawJunction(ctx, this.lineConfig.points[0]);

        ctx.beginPath();
        ctx.moveTo(this.lineConfig.points[0].x, this.lineConfig.points[0].y);
        for (let index = 1; index < this.lineConfig.points.length; index++) {
            const point = this.lineConfig.points[index];
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        ctx.closePath();

        for (let index = 1; index < (this.lineConfig.closedLoop ? this.lineConfig.points.length - 1 : this.lineConfig.points.length); index++) {
            const point = this.lineConfig.points[index];

            this.drawJunction(ctx, point);
        }
    }
}
