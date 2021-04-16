import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ShapeConfig, ShapeMode } from '@app/classes/tool-config/shape-config';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
export class EllipseDraw extends AbstractDraw {
    private config: ShapeConfig;

    constructor(colorService: ColorService, config: ShapeConfig) {
        super(colorService);
        this.config = config.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        const radius: Vec2 = new Vec2(
            (this.config.endCoords.x - this.config.startCoords.x) / 2,
            (this.config.endCoords.y - this.config.startCoords.y) / 2,
        );
        const center: Vec2 = this.config.startCoords.add(radius);

        if (this.config.shiftDown) {
            const minRadius = Math.min(Math.abs(radius.x), Math.abs(radius.y));
            center.x = this.config.startCoords.x + Math.sign(radius.x) * minRadius;
            center.y = this.config.startCoords.y + Math.sign(radius.y) * minRadius;
            radius.x = minRadius;
            radius.y = minRadius;
        }

        const radiusAbs: Vec2 = radius.apply(Math.abs);

        if (this.config.showPerimeter) {
            this.drawRectanglePerimeter(context, center, radiusAbs);
        }

        context.strokeStyle = this.secondaryRgba;
        context.fillStyle = this.primaryRgba;
        context.lineWidth = this.config.lineWidth;
        context.lineCap = 'round' as CanvasLineCap;
        context.lineJoin = 'round' as CanvasLineJoin;

        context.beginPath();
        switch (this.config.shapeMode) {
            case ShapeMode.Contour:
                context.ellipse(center.x, center.y, radiusAbs.x, radiusAbs.y, 0, 0, 2 * Math.PI);
                context.stroke();
                break;
            case ShapeMode.Filled:
                context.lineWidth = 0;
                context.ellipse(center.x, center.y, radiusAbs.x, radiusAbs.y, 0, 0, 2 * Math.PI);
                context.fill();
                break;
            case ShapeMode.FilledWithContour:
                context.ellipse(center.x, center.y, radiusAbs.x, radiusAbs.y, 0, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
                break;
            default:
                break;
        }

        context.closePath();
    }

    private drawRectanglePerimeter(ctx: CanvasRenderingContext2D, center: Vec2, radius: Vec2): void {
        const dashWidth = 1;
        let lineWidth: number = this.config.lineWidth;

        if (this.config.shapeMode === ShapeMode.Filled) {
            lineWidth = 0;
        }

        const position = center.substract(radius).substractValue(lineWidth / 2);
        const size = radius.scalar(2).addValue(lineWidth);

        const lineDash = 6;
        ctx.lineWidth = dashWidth;
        ctx.strokeStyle = 'gray';
        ctx.setLineDash([lineDash]);
        ctx.beginPath();
        ctx.strokeRect(position.x, position.y, size.x, size.y);
        ctx.stroke();
        ctx.closePath();
        ctx.setLineDash([]);
    }
}
