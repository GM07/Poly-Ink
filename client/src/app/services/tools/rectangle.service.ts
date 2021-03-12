import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { RectangleToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { AbstractShape, Mode } from './abstract-shape.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends AbstractShape {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(RectangleToolConstants.SHORTCUT_KEY);
    }

    protected updateShape(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawShape(ctx);
    }

    protected drawShape(ctx: CanvasRenderingContext2D): void {
        let width: number = this.mouseUpCoord.x - this.mouseDownCoord.x;
        let height: number = this.mouseUpCoord.y - this.mouseDownCoord.y;
        if (this.SHIFT.isDown) {
            height = Math.sign(height) * Math.min(Math.abs(width), Math.abs(height));
            width = Math.sign(width) * Math.abs(height);
        }
        ctx.lineWidth = this.lineWidthIn;
        ctx.strokeStyle = this.colorService.secondaryRgba;
        ctx.fillStyle = this.colorService.primaryRgba;
        ctx.lineJoin = 'miter' as CanvasLineJoin;
        ctx.lineCap = 'square' as CanvasLineCap;
        ctx.beginPath();

        switch (this.mode) {
            case Mode.Contour:
                ctx.strokeRect(this.mouseDownCoord.x, this.mouseDownCoord.y, width, height);
                break;
            case Mode.Filled:
                ctx.fillRect(this.mouseDownCoord.x, this.mouseDownCoord.y, width, height);
                break;
            case Mode.FilledWithContour:
                ctx.rect(this.mouseDownCoord.x, this.mouseDownCoord.y, width, height);
                ctx.fill();
                break;
            default:
                break;
        }

        ctx.stroke();
        ctx.closePath();
    }
}
