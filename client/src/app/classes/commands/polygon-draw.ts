import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ShapeConfig, ShapeMode } from '@app/classes/tool-config/shape-config';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from 'src/color-picker/services/color.service';

export class PolygonDraw extends AbstractDraw {
    private config: ShapeConfig;

    constructor(colorService: ColorService, config: ShapeConfig) {
        super(colorService);
        this.config = config.clone();
    }

    execute(ctx: CanvasRenderingContext2D): void {
        const radiusVec: Vec2 = this.config.endCoords
            .substract(this.config.startCoords)
            .apply(Math.abs)
            .scalar(1 / 2);
        const radius: number = Math.min(radiusVec.x, radiusVec.y);

        const center: Vec2 = this.config.startCoords.addValue(radius);

        if (this.config.endCoords.y < this.config.startCoords.y) {
            center.y = this.config.startCoords.y - radius;
        }

        if (this.config.endCoords.x < this.config.startCoords.x) {
            center.x = this.config.startCoords.x - radius;
        }

        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;

        if (this.config.showPerimeter) {
            this.drawCirclePerimeter(ctx, center, radius);
        }

        this.drawPolygoneSides(ctx, center, radius);
        ctx.closePath();
    }

    private drawPolygoneSides(ctx: CanvasRenderingContext2D, center: Vec2, radiusAbs: number): void {
        // Need the number 2 to get half of PI and to get if number is odd or even
        // tslint:disable-next-line:no-magic-numbers
        const startingAngle = -Math.PI / 2 + (this.config.numEdges % 2 !== 0 ? 0 : Math.PI / this.config.numEdges);
        ctx.lineWidth = this.config.shapeMode === ShapeMode.Filled ? 0 : this.config.lineWidth;

        if (ctx.lineWidth > radiusAbs) ctx.lineWidth = Math.max(1, radiusAbs);

        const lineWidthWeightedRadius = Math.max(ctx.lineWidth / 2, radiusAbs - ctx.lineWidth / 2);

        ctx.beginPath();
        for (let i = 0; i < this.config.numEdges; i++) {
            const currentX = center.x + lineWidthWeightedRadius * Math.cos(startingAngle + (i * (2 * Math.PI)) / this.config.numEdges);
            const currentY = center.y + lineWidthWeightedRadius * Math.sin(startingAngle + (i * (2 * Math.PI)) / this.config.numEdges);
            ctx.lineTo(currentX, currentY);
        }
        ctx.closePath();

        ctx.strokeStyle = this.secondaryRgba;
        ctx.fillStyle = this.primaryRgba;
        if (this.config.shapeMode !== ShapeMode.Contour) {
            ctx.fill();
        }
        if (this.config.shapeMode !== ShapeMode.Filled) {
            ctx.stroke();
        }
    }

    private drawCirclePerimeter(ctx: CanvasRenderingContext2D, center: Vec2, radiusAbs: number): void {
        const dashWidth = 1;
        const lineDash = 6;
        ctx.lineWidth = dashWidth;
        ctx.strokeStyle = 'black';
        ctx.setLineDash([lineDash]);
        ctx.beginPath();
        ctx.arc(center.x, center.y, radiusAbs, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
        ctx.setLineDash([]);
    }
}
