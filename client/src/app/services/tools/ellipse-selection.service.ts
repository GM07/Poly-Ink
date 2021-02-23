import { Injectable } from '@angular/core';
import { EllipseSelectionToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { ColorService } from 'src/color-picker/services/color.service';
import { DrawingService } from '../drawing/drawing.service';
import { RectangleSelectionService } from './rectangle-selection.service';
import { Vec2 } from '@app/classes/vec2';
import { ShortcutKey } from '@app/classes/shortcut-key';

@Injectable({
  providedIn: 'root',
})
export class EllipseSelectionService extends RectangleSelectionService {
  stopDrawing(): void { }

  private centerX : number;
  private centerY: number;
  private radiusXAbs : number;
  private radiusYAbs : number;


  constructor(drawingService: DrawingService, colorService: ColorService) {
    super(drawingService, colorService);
    this.shortcutKey = new ShortcutKey(EllipseSelectionToolConstants.SHORTCUT_KEY);
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

  private updateSize(width:number, height:number, x:number, y:number){
    let radiusX: number = (width) / 2;
    let radiusY: number = (height) / 2;
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

    ctx.setLineDash([this.LINE_DASH, this.LINE_DASH]);
    ctx.strokeStyle = 'black';
    ctx.lineCap = 'round' as CanvasLineCap;
    ctx.lineJoin = 'round' as CanvasLineJoin;

    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.ellipse(this.centerX, this.centerY, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
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
    this.updateSize(this.mouseUpCoord.x-this.mouseDownCoord.x, this.mouseUpCoord.y - this.mouseDownCoord.y, this.mouseDownCoord.x, this.mouseDownCoord.y);

    const baseCtx = this.drawingService.baseCtx;
    this.selectionData = baseCtx.getImageData(this.mouseDownCoord.x, this.mouseDownCoord.y, this.width, this.height);

    const previewCtx = this.drawingService.previewCtx;
    const imageDataCoords = this.getImageDataCoords();

    previewCtx.putImageData(this.selectionData, imageDataCoords.x, imageDataCoords.y);
    this.drawPreviewSelection(previewCtx);

    baseCtx.fillStyle = 'red';
    baseCtx.beginPath();
    baseCtx.ellipse(this.centerX, this.centerY, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
    baseCtx.fill();
    baseCtx.closePath();
  }

  protected updateSelection(translation: Vec2): void {
    if (this.selectionData === undefined) return;
    let imageDataCoords = this.getImageDataCoords();
    imageDataCoords.x += translation.x;
    imageDataCoords.y += translation.y;

    this.updateSize(this.width, this.height,imageDataCoords.x, imageDataCoords.y);

    const ctx = this.drawingService.previewCtx;
    const rectangleCoords = { x: this.mouseDownCoord.x + translation.x, y: this.mouseDownCoord.y + translation.y } as Vec2;
    this.drawingService.clearCanvas(ctx);
    ctx.beginPath();
    ctx.save();
    ctx.ellipse(this.centerX, this.centerY, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(this.imagedata_to_image(this.selectionData), imageDataCoords.x, imageDataCoords.y);
    this.drawSelection(ctx, rectangleCoords);
    ctx.restore();
    this.drawRectanglePerimeter(ctx, this.centerX, this.centerY, this.radiusXAbs, this.radiusYAbs);
  }

  protected endSelection(): void {
    if (this.selectionData === undefined) return;
    const baseCtx = this.drawingService.baseCtx;
    const imageDataCoords = this.getImageDataCoords();

    this.updateSize(this.width,this.height,imageDataCoords.x,imageDataCoords.y);

    baseCtx.beginPath();
    baseCtx.save();                                   // for removing clip later
    baseCtx.ellipse(this.centerX, this.centerY, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);  // draw a full arc on target
    baseCtx.clip();
    baseCtx.drawImage(this.imagedata_to_image(this.selectionData), imageDataCoords.x, imageDataCoords.y);
    baseCtx.restore();
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    this.selectionData = undefined;
}

  private imagedata_to_image(imagedata : ImageData): HTMLImageElement{
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    canvas.width = imagedata.width;
    canvas.height = imagedata.height;
    ctx.putImageData(imagedata, 0, 0);

    let image = new Image();
    image.src = canvas.toDataURL();
    return image;
  }
}
