import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { PolygonConfig, PolygonMode } from '@app/classes/tool-config/polygon-config';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from 'src/color-picker/services/color.service';

export class PolygonDraw extends AbstractDraw {
    config: PolygonConfig;

    constructor(colorService: ColorService, config: PolygonConfig) {
        super(colorService);
        this.config = config;
    }

    execute(ctx: CanvasRenderingContext2D): void {
        const radiusX: number = Math.abs(this.config.endCoords.x - this.config.startCoords.x) / 2;
        const radiusY: number = Math.abs(this.config.endCoords.y - this.config.startCoords.y) / 2;
        const radius: number = Math.min(radiusX, radiusY);

        let centerX: number = this.config.startCoords.x + radius;
        let centerY: number = this.config.startCoords.y + radius;

        if (this.config.endCoords.y < this.config.startCoords.y) {
            centerY = this.config.startCoords.y - radius;
        }

        if (this.config.endCoords.x < this.config.startCoords.x) {
            centerX = this.config.startCoords.x - radius;
        }

        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;
        const center: Vec2 = {
            x: centerX,
            y: centerY,
        };

        if (this.config.showPerimeter) {
            this.drawCirclePerimeter(ctx, center, radius);
        }

        this.drawPolygoneSides(ctx, center, radius);
        ctx.closePath();
    }

    private drawPolygoneSides(ctx: CanvasRenderingContext2D, center: Vec2, radiusAbs: number): void {
        const centerX: number = center.x;
        const centerY: number = center.y;

        // tslint:disable-next-line:no-magic-numbers
        const startingAngle = -Math.PI / 2 + (this.config.numEdges % 2 !== 0 ? 0 : Math.PI / this.config.numEdges);
        ctx.lineWidth = this.config.polygonMode === PolygonMode.Filled ? 0 : this.config.lineWidth;

        if (ctx.lineWidth > radiusAbs) ctx.lineWidth = Math.max(1, radiusAbs);

        const lineWidthWeightedRadius = Math.max(ctx.lineWidth / 2, radiusAbs - ctx.lineWidth / 2);

        ctx.beginPath();
        for (let i = 0; i < this.config.numEdges; i++) {
            const currentX = centerX + lineWidthWeightedRadius * Math.cos(startingAngle + (i * (2 * Math.PI)) / this.config.numEdges);
            const currentY = centerY + lineWidthWeightedRadius * Math.sin(startingAngle + (i * (2 * Math.PI)) / this.config.numEdges);
            ctx.lineTo(currentX, currentY);
        }
        ctx.closePath();

        ctx.strokeStyle = this.secondaryRgba;
        ctx.fillStyle = this.primaryRgba;
        if (this.config.polygonMode !== PolygonMode.Contour) {
            ctx.fill();
        }
        if (this.config.polygonMode !== PolygonMode.Filled) {
            ctx.stroke();
        }
    }

    private drawCirclePerimeter(ctx: CanvasRenderingContext2D, center: Vec2, radiusAbs: number): void {
        const dashWidth = 1;
        const lineDash = 6;
        const centerX: number = center.x;
        const centerY: number = center.y;
        ctx.lineWidth = dashWidth;
        ctx.strokeStyle = 'black';
        ctx.setLineDash([lineDash]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radiusAbs, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
        ctx.setLineDash([]);
    }
}
