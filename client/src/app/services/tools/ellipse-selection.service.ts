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
    stopDrawing(): void {}

    private centerX: number;
    private centerY: number;
    private radiusXAbs: number;
    private radiusYAbs: number;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(EllipseSelectionToolConstants.SHORTCUT_KEY);
        this.toolID = EllipseSelectionToolConstants.TOOL_ID;
    }

    private updateSize(width: number, height: number, x: number, y: number) {
        let radiusX: number = width / 2;
        let radiusY: number = height / 2;
        this.centerX = x + radiusX;
        this.centerY = y + radiusY;

        if (this.shiftPressed) {
            const minRadius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
            this.centerX = x + Math.sign(radiusX) * minRadius;
            this.centerY = y + Math.sign(radiusY) * minRadius;
            radiusX = minRadius;
            radiusY = minRadius;
        }

        this.radiusXAbs = Math.abs(radiusX);
        this.radiusYAbs = Math.abs(radiusY);
    }

    protected drawSelection(ctx: CanvasRenderingContext2D, position: Vec2): void {
        this.updateSize(this.width, this.height, position.x, position.y);

        if (ctx === this.drawingService.previewCtx) {
            this.drawRectanglePerimeter(ctx, this.centerX, this.centerY, this.radiusXAbs, this.radiusYAbs);
        }

        ctx.lineWidth = 2;
        ctx.setLineDash([this.LINE_DASH, this.LINE_DASH]);
        ctx.strokeStyle = 'black';
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;

        ctx.ellipse(this.centerX, this.centerY, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.setLineDash([0]);

        ctx.closePath();
    }

  private drawRectanglePerimeter(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radiusX: number, radiusY: number): void {
    const lineWidth = 2;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash([this.LINE_DASH, this.LINE_DASH]);
    const x = centerX - radiusX - lineWidth / 2;
    const y = centerY - radiusY - lineWidth / 2;
    const width = radiusX * 2 + lineWidth;
    const height = radiusY * 2 + lineWidth;

    ctx.strokeStyle = 'gray';
    ctx.beginPath();
    ctx.strokeRect(x, y, width, height);
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);
  }

  protected fillBackground(baseCtx: CanvasRenderingContext2D):void{
    this.updateSize(this.mouseUpCoord.x-this.mouseDownCoord.x, this.mouseUpCoord.y - this.mouseDownCoord.y, this.mouseDownCoord.x, this.mouseDownCoord.y);
    baseCtx.ellipse(this.centerX, this.centerY, this.radiusXAbs-1, this.radiusYAbs-1, 0, 0, 2 * Math.PI);
    baseCtx.fill();
  }

  protected drawPreview(ctx: CanvasRenderingContext2D, rectangleCoords : Vec2, left: number, top: number): void {
    ctx.beginPath();
    ctx.save();
    ctx.ellipse(this.centerX, this.centerY, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(this.selectionData, 0, 0, this.width, this.height, left, top, this.width, this.height);
    this.drawSelection(ctx, rectangleCoords);
    ctx.restore();
    this.drawRectanglePerimeter(ctx, this.centerX, this.centerY, this.radiusXAbs, this.radiusYAbs);

  }

  protected endSelection(): void {
    if (this.selectionCtx === null) return;
    const baseCtx = this.drawingService.baseCtx;

    this.updateSize(this.width,this.height,this.selectionCoords.x,this.selectionCoords.y);

    baseCtx.beginPath();
    baseCtx.save();
    baseCtx.ellipse(this.centerX, this.centerY, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
    baseCtx.clip();
    baseCtx.drawImage(this.selectionData, 0, 0, this.width, this.height, this.selectionCoords.x, this.selectionCoords.y, this.width, this.height);
    baseCtx.restore();
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    this.selectionCtx = null;
    this.selectionCoords = { x: 0, y: 0 } as Vec2;
  }
}
