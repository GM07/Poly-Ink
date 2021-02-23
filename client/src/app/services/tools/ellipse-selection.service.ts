import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut-key';
import { Tool } from '@app/classes/tool';
import { EllipseSelectionToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { ColorService } from 'src/color-picker/services/color.service';
import { DrawingService } from '../drawing/drawing.service';
import { RectangleSelectionService } from './rectangle-selection.service';
import { Vec2 } from '@app/classes/vec2';

@Injectable({
  providedIn: 'root',
})
export class EllipseSelectionService extends RectangleSelectionService {
  stopDrawing(): void { }

  constructor(drawingService: DrawingService, colorService: ColorService) {
    super(drawingService, colorService);
    this.shortcutKey = EllipseSelectionToolConstants.SHORTCUT_KEY;
    this.toolID = EllipseSelectionToolConstants.TOOL_ID;
  }

  protected drawPreviewSelection(ctx: CanvasRenderingContext2D): void {
    this.width = this.mouseUpCoord.x - this.mouseDownCoord.x;
    this.height = this.mouseUpCoord.y - this.mouseDownCoord.y;
    if (this.shiftPressed) {
      this.height = Math.sign(this.height) * Math.min(Math.abs(this.width), Math.abs(this.height));
      this.width = Math.sign(this.width) * Math.abs(this.height);
    }
    this.drawSelection(ctx, this.mouseDownCoord);
  }

  protected drawSelection(ctx: CanvasRenderingContext2D, position: Vec2): void {
    let radiusX: number = (this.width) / 2;
    let radiusY: number = (this.height) / 2;
    let centerX: number = position.x + radiusX;
    let centerY: number = position.y + radiusY;

    if (this.shiftPressed) {
      const minRadius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
      centerX = position.x + Math.sign(radiusX) * minRadius;
      centerY = position.y + Math.sign(radiusY) * minRadius;
      radiusX = minRadius;
      radiusY = minRadius;
    }

    const radiusXAbs = Math.abs(radiusX);
    const radiusYAbs = Math.abs(radiusY);

    if (ctx === this.drawingService.previewCtx) {
      this.drawRectanglePerimeter(ctx, centerX, centerY, radiusXAbs, radiusYAbs);
    }

    ctx.setLineDash([this.LINE_DASH, this.LINE_DASH]);
    ctx.strokeStyle = 'black';
    ctx.lineCap = 'round' as CanvasLineCap;
    ctx.lineJoin = 'round' as CanvasLineJoin;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([0]);


    ctx.closePath();
  }


  private drawRectanglePerimeter(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radiusX: number, radiusY: number): void {
    const lineWidth = 1;
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


  protected startSelection(): void {
    if (this.width === 0 || this.height === 0) return;
    let radiusX: number = (this.mouseUpCoord.x - this.mouseDownCoord.x) / 2;
    let radiusY: number = (this.mouseUpCoord.y - this.mouseDownCoord.y) / 2;
    let centerX: number = this.mouseDownCoord.x + radiusX;
    let centerY: number = this.mouseDownCoord.y + radiusY;

    if (this.shiftPressed) {
      const minRadius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
      centerX = this.mouseDownCoord.x + Math.sign(radiusX) * minRadius;
      centerY = this.mouseDownCoord.y + Math.sign(radiusY) * minRadius;
      radiusX = minRadius;
      radiusY = minRadius;
    }

    const radiusXAbs = Math.abs(radiusX);
    const radiusYAbs = Math.abs(radiusY);

    const baseCtx = this.drawingService.baseCtx;
    this.selectionData = baseCtx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, this.width, this.height);

    const previewCtx = this.drawingService.previewCtx;
    const imageDataCoords = this.getImageDataCoords();


    previewCtx.save();
    previewCtx.beginPath();
    previewCtx.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
    previewCtx.clip();
    previewCtx.putImageData(this.selectionData, imageDataCoords.x, imageDataCoords.y);
    this.drawPreviewSelection(previewCtx);
    previewCtx.restore();

    baseCtx.fillStyle = 'red';
    baseCtx.beginPath();
    baseCtx.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
    baseCtx.fill();
    baseCtx.closePath();
  }

  protected updateSelection(translation: Vec2): void {
    if (this.selectionData === undefined) return;
    let imageDataCoords = this.getImageDataCoords();
    imageDataCoords.x += translation.x;
    imageDataCoords.y += translation.y;

    let radiusX: number = (this.width) / 2;
    let radiusY: number = (this.height) / 2;
    let centerX: number = imageDataCoords.x + radiusX;
    let centerY: number = imageDataCoords.y + radiusY;

    if (this.shiftPressed) {
      const minRadius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
      centerX = imageDataCoords.x + Math.sign(radiusX) * minRadius;
      centerY = imageDataCoords.y + Math.sign(radiusY) * minRadius;
      radiusX = minRadius;
      radiusY = minRadius;
    }

    const radiusXAbs = Math.abs(radiusX);
    const radiusYAbs = Math.abs(radiusY);

    const ctx = this.drawingService.previewCtx;
    const rectangleCoords = { x: this.mouseDownCoord.x + translation.x, y: this.mouseDownCoord.y + translation.y } as Vec2;
    this.drawingService.clearCanvas(ctx);
    ctx.putImageData(this.selectionData, imageDataCoords.x, imageDataCoords.y);
    this.drawSelection(ctx, rectangleCoords);

    var maskCanvas = document.createElement('canvas');
    maskCanvas.width = this.drawingService.previewCanvas.width;
    maskCanvas.height = this.drawingService.previewCanvas.height;
    var maskCtx = maskCanvas.getContext('2d');

    maskCtx.fillStyle = "rgba(255,255,255,1)";
    maskCtx.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
    maskCtx.globalCompositeOperation = 'destination-in';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    maskCtx.fill();

    ctx.drawImage(maskCanvas, 0, 0);1

}
}
