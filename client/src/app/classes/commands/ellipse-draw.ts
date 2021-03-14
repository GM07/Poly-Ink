import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { EllipseConfig, EllipseMode } from '@app/classes/tool-config/ellipse-config';
import { ColorService } from 'src/color-picker/services/color.service';
export class EllipseDraw extends AbstractDraw {
    config: EllipseConfig;

    constructor(colorService: ColorService, config: EllipseConfig) {
        super(colorService);
        this.config = config;
    }

    execute(context: CanvasRenderingContext2D): void {
        let radiusX: number = (this.config.endCoords.x - this.config.startCoords.x) / 2;
        let radiusY: number = (this.config.endCoords.y - this.config.startCoords.y) / 2;
        let centerX: number = this.config.startCoords.x + radiusX;
        let centerY: number = this.config.startCoords.y + radiusY;

        if (this.config.shiftDown) {
            const minRadius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
            centerX = this.config.startCoords.x + Math.sign(radiusX) * minRadius;
            centerY = this.config.startCoords.y + Math.sign(radiusY) * minRadius;
            radiusX = minRadius;
            radiusY = minRadius;
        }

        const radiusXAbs = Math.abs(radiusX);
        const radiusYAbs = Math.abs(radiusY);

        if (this.config.showPerimeter) {
            this.drawRectanglePerimeter(context, centerX, centerY, radiusXAbs, radiusYAbs);
        }

        context.strokeStyle = this.secondaryRgba;
        context.fillStyle = this.primaryRgba;
        context.lineWidth = this.config.lineWidth;
        context.lineCap = 'round' as CanvasLineCap;
        context.lineJoin = 'round' as CanvasLineJoin;

        context.beginPath();
        switch (this.config.ellipseMode) {
            case EllipseMode.Contour:
                context.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
                context.stroke();
                break;
            case EllipseMode.Filled:
                context.lineWidth = 0;
                context.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
                context.fill();
                break;
            case EllipseMode.FilledWithContour:
                context.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
                context.fill();
                context.stroke();
                break;
            default:
                break;
        }

        context.closePath();
    }

    private drawRectanglePerimeter(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radiusX: number, radiusY: number): void {
        const dashWidth = 1;
        let lineWidth: number = this.config.lineWidth;

        if (this.config.ellipseMode === EllipseMode.Filled) {
            lineWidth = 0;
        }

        const x = centerX - radiusX - lineWidth / 2;
        const y = centerY - radiusY - lineWidth / 2;
        const width = radiusX * 2 + lineWidth;
        const height = radiusY * 2 + lineWidth;

        const lineDash = 6;
        ctx.lineWidth = dashWidth;
        ctx.strokeStyle = 'gray';
        ctx.setLineDash([lineDash]);
        ctx.beginPath();
        ctx.strokeRect(x, y, width, height);
        ctx.stroke();
        ctx.closePath();
        ctx.setLineDash([]);
    }
}
