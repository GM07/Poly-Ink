import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut-key';
import { EllipseSelectionToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from 'src/color-picker/services/color.service';
import { DrawingService } from '../drawing/drawing.service';
import { RectangleSelectionService } from './rectangle-selection.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionService extends RectangleSelectionService {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(EllipseSelectionToolConstants.SHORTCUT_KEY);
        this.toolID = EllipseSelectionToolConstants.TOOL_ID;
    }

    private centerX: number;
    private centerY: number;
    private radiusXAbs: number;
    private radiusYAbs: number;
    stopDrawing(): void {
        super.stopDrawing();
    }

    // private updateSize(width: number, height: number, x: number, y: number) {
    //     let radiusX: number = width / 2;
    //     let radiusY: number = height / 2;
    //     this.centerX = x + radiusX;
    //     this.centerY = y + radiusY;

    //     if (this.shiftPressed) {
    //         const minRadius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
    //         this.centerX = x + Math.sign(radiusX) * minRadius;
    //         this.centerY = y + Math.sign(radiusY) * minRadius;
    //         radiusX = minRadius;
    //         radiusY = minRadius;
    //     }

    //     this.radiusXAbs = Math.abs(radiusX);
    //     this.radiusYAbs = Math.abs(radiusY);
    // }

    protected drawPreviewSelection(ctx: CanvasRenderingContext2D): void {
        this.width = this.mouseUpCoord.x - this.mouseDownCoord.x;
        this.height = this.mouseUpCoord.y - this.mouseDownCoord.y;
        let radiusX: number = this.width / 2;
        let radiusY: number = this.height / 2;
        this.centerX = this.mouseDownCoord.x + radiusX;
        this.centerY = this.mouseDownCoord.y + radiusY;

        if (this.shiftPressed) {
            const minRadius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
            this.centerX = this.mouseDownCoord.x + Math.sign(radiusX) * minRadius;
            this.centerY = this.mouseDownCoord.y + Math.sign(radiusY) * minRadius;
            radiusX = minRadius;
            radiusY = minRadius;
        }

        this.radiusXAbs = Math.abs(radiusX);
        this.radiusYAbs = Math.abs(radiusY);

        this.drawEllipseSelection(ctx, this.centerX, this.centerY);
    }

    protected drawEllipseSelection(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
        if (ctx === this.drawingService.previewCtx) {
            this.drawRectanglePerimeter(ctx, centerX, centerY, this.radiusXAbs, this.radiusYAbs);
        }

        ctx.beginPath();

        ctx.lineWidth = 2;
        ctx.setLineDash([this.LINE_DASH, this.LINE_DASH]);
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;

        ctx.strokeStyle = 'black';
        ctx.ellipse(centerX, centerY, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.closePath();
        ctx.beginPath();

        ctx.lineDashOffset = this.LINE_DASH;
        ctx.strokeStyle = 'white';
        ctx.ellipse(centerX, centerY, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.lineDashOffset = 0;
        ctx.setLineDash([]);

        ctx.closePath();
    }

    private drawRectanglePerimeter(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radiusX: number, radiusY: number): void {
        const lineWidth = 2;
        ctx.lineWidth = lineWidth;
        const x = centerX - radiusX - lineWidth / 2;
        const y = centerY - radiusY - lineWidth / 2;
        const width = radiusX * 2 + lineWidth;
        const height = radiusY * 2 + lineWidth;

        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.strokeRect(x, y, width, height);
        ctx.stroke();
        ctx.closePath();
    }

    protected fillBackground(baseCtx: CanvasRenderingContext2D): void {
        baseCtx.ellipse(this.centerX, this.centerY, this.radiusXAbs - 1, this.radiusYAbs - 1, 0, 0, 2 * Math.PI);
        baseCtx.fill();
    }

    protected updateSelection(translation: Vec2): void {
        if (this.selectionCtx === null) return;

        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        const left = this.selectionCoords.x + translation.x;
        const top = this.selectionCoords.y + translation.y;
        const centerX = left + this.radiusXAbs;
        const centerY = top + this.radiusYAbs;

        ctx.beginPath();
        ctx.save();
        ctx.ellipse(centerX, centerY, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(this.SELECTION_DATA, left, top);
        ctx.restore();
        this.drawEllipseSelection(ctx, centerX, centerY);
    }

    protected endSelection(): void {
        if (this.selectionCtx === null) return;
        const baseCtx = this.drawingService.baseCtx;
        const centerX = this.selectionCoords.x + this.radiusXAbs;
        const centerY = this.selectionCoords.y + this.radiusYAbs;

        baseCtx.beginPath();
        baseCtx.save();
        baseCtx.ellipse(centerX, centerY, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
        baseCtx.clip();
        baseCtx.drawImage(this.SELECTION_DATA, this.selectionCoords.x, this.selectionCoords.y);
        baseCtx.restore();
        baseCtx.closePath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectionCtx = null;
        this.selectionCoords = { x: 0, y: 0 } as Vec2;
    }
}
