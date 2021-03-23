import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { StampToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from 'src/color-picker/services/color.service';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
  providedIn: 'root'
})
export class StampService extends Tool{

  private etampe = new Image();
  public scale: number;
  private angle = Math.PI/4;
  private position: Vec2;
  public alt: boolean;

  constructor(protected drawingService: DrawingService, protected colorService: ColorService) {
    super(drawingService, colorService);
    this.shortcutKey = new ShortcutKey(StampToolConstants.SHORTCUT_KEY);
    this.toolID = StampToolConstants.TOOL_ID;
    this.etampe.src = 'assets/stamps/alexis.png';
    this.scale = 1;
    this.alt = false;
  }

   set scaleValue(scale: number) {
    this.scale = Math.min(Math.max(scale, 0.1), 5);
  }

  set angleValue(angle: number) {
    this.angle = Math.min(Math.max(angle/180*Math.PI, 0), 2*Math.PI);
  }

  get angleValue(): number{
    return this.angle/Math.PI*180;
  }

   onMouseMove(event: MouseEvent){
    this.position = this.getPositionFromMouse(event);
    this.updateStampPreview();
  }

   onMouseDown(event: MouseEvent){
    const position = this.getPositionFromMouse(event);
    this.rotateAndPaintImage(this.drawingService.baseCtx, this.etampe, this.angle, position);
  }

  onKeyDown(event: KeyboardEvent){
    this.alt = (event.altKey && !this.alt);
  }

  onKeyUp(event: KeyboardEvent){
    this.alt = !(!event.altKey && this.alt);
  }

  onMouseEnter(event: MouseEvent){
    document.body.style.cursor = 'none';
  }

  updateStampPreview(){
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
    this.rotateAndPaintImage(this.drawingService.previewCtx, this.etampe, this.angle, this.position);
  }

   rotateAndPaintImage ( context: CanvasRenderingContext2D, image: HTMLImageElement, angleInRad: number , position: Vec2) {
    context.translate( position.x, position.y );
    context.rotate( angleInRad );
    context.drawImage( image, -50*this.scale/2, -50*this.scale/2,  50*this.scale, 50*this.scale);
    context.rotate( -angleInRad );
    context.translate( -position.x, -position.y );
  }
}
