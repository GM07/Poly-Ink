import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { EllipseToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { AbstractShape, ShapeMode } from './abstract-shape.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends AbstractShape {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(EllipseToolConstants.SHORTCUT_KEY);
    }

    protected updateShape(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawShape(ctx);
    }

    protected drawShape(ctx: CanvasRenderingContext2D): void {
        let radiusX: number = (this.mouseUpCoord.x - this.mouseDownCoord.x) / 2;
        let radiusY: number = (this.mouseUpCoord.y - this.mouseDownCoord.y) / 2;
        let centerX: number = this.mouseDownCoord.x + radiusX;
        let centerY: number = this.mouseDownCoord.y + radiusY;

        if (this.SHIFT.isDown) {
            const minRadius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
            centerX = this.mouseDownCoord.x + Math.sign(radiusX) * minRadius;
            centerY = this.mouseDownCoord.y + Math.sign(radiusY) * minRadius;
            radiusX = minRadius;
            radiusY = minRadius;
        }

        const radiusXAbs = Math.abs(radiusX);
        const radiusYAbs = Math.abs(radiusY);

        if (ctx === this.drawingService.previewCtx)
            this.drawRectanglePerimeter(ctx, { x: centerX, y: centerY } as Vec2, { x: radiusXAbs, y: radiusYAbs } as Vec2);

        ctx.strokeStyle = this.colorService.secondaryRgba;
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;

        ctx.beginPath();
        switch (this.shapeMode) {
            case ShapeMode.Contour:
                ctx.lineWidth = this.lineWidthIn;
                ctx.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
                ctx.stroke();
                break;
            case ShapeMode.Filled:
                ctx.lineWidth = 0;
                ctx.fillStyle = this.colorService.primaryRgba;
                ctx.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case ShapeMode.FilledWithContour:
                ctx.lineWidth = this.lineWidthIn;
                ctx.fillStyle = this.colorService.primaryRgba;
                ctx.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                break;
            default:
                break;
        }

        ctx.closePath();
    }

    private drawRectanglePerimeter(ctx: CanvasRenderingContext2D, center: Vec2, radius: Vec2): void {
        const dashWidth = 1;
        let lineWidth: number = this.lineWidthIn;
        if (this.shapeMode === ShapeMode.Filled) {
            lineWidth = 0;
        }
        const x = center.x - radius.x - lineWidth / 2;
        const y = center.y - radius.y - lineWidth / 2;
        const width = radius.x * 2 + lineWidth;
        const height = radius.y * 2 + lineWidth;

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
