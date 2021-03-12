import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { EyeDropperToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { Color } from 'src/color-picker/classes/color';

@Injectable({
  providedIn: 'root'
})
export class PipetteService extends Tool {

  toolID: string;
  previsualisationCanvas: HTMLCanvasElement;
  previsualisationCtx: CanvasRenderingContext2D;

  constructor(drawingService: DrawingService, colorService: ColorService) {
    super(drawingService, colorService);
    this.toolID = EyeDropperToolConstants.TOOL_ID;
    this.shortcutKey = new ShortcutKey(EyeDropperToolConstants.SHORTCUT_KEY);
   }

   public stopDrawing() : void {

   }

   public onMouseDown(event: MouseEvent) : void{
     if(this.isInCanvas(event)){
      const pos : Vec2 = this.getPositionFromMouse(event);
      const color : Uint8ClampedArray = this.drawingService.baseCtx.getImageData(pos.x, pos.y, 1, 1).data;
      if(event.button == MouseButton.Left){
       this.colorService.primaryColor = new Color(color[0], color[1], color[2]);
      } else if(event.button == MouseButton.Right){
        this.colorService.secondaryColor = new Color(color[0], color[1], color[2]);
        event.preventDefault();
      }
     }
  }

  public onMouseMove(event: MouseEvent): void {
    event.preventDefault();
    const size = 10;
    const data : HTMLCanvasElement = this.getPrevisualisation(this.getPositionFromMouse(event), {x: size, y: size} as Vec2);
    if(this.previsualisationCtx !== undefined){
      if(this.isInCanvas(event)){
        this.previsualisationCtx.imageSmoothingEnabled = false;
        this.previsualisationCtx.beginPath();
        this.previsualisationCtx.save();
        this.previsualisationCtx.ellipse(this.previsualisationCanvas.width/2, this.previsualisationCanvas.height/2, this.previsualisationCanvas.width/2, this.previsualisationCanvas.height/2, 0, 0, 2 * Math.PI);
        this.previsualisationCtx.clip();
        this.previsualisationCtx.drawImage(data, 0, 0, size, size, 0, 0, this.previsualisationCanvas.width, this.previsualisationCanvas.height);
        this.previsualisationCtx.restore();
        this.previsualisationCtx.lineWidth = 1;
        this.previsualisationCtx.setLineDash([2,2]);
        this.previsualisationCtx.strokeStyle = "black";
        this.previsualisationCtx.lineJoin = 'miter' as CanvasLineJoin;
        this.previsualisationCtx.lineCap = 'square' as CanvasLineCap;
        this.previsualisationCtx.strokeRect(this.previsualisationCanvas.width/2, this.previsualisationCanvas.height/2, this.previsualisationCanvas.width/size, this.previsualisationCanvas.height/size);
        this.previsualisationCtx.lineDashOffset = 2;
        this.previsualisationCtx.strokeStyle = "white";
        this.previsualisationCtx.strokeRect(this.previsualisationCanvas.width/2, this.previsualisationCanvas.height/2, this.previsualisationCanvas.width/size, this.previsualisationCanvas.height/size);
        this.previsualisationCtx.lineDashOffset = 0;
        this.previsualisationCtx.setLineDash([]);
      } else {
        this.previsualisationCtx.clearRect(0,0,this.previsualisationCanvas.width, this.previsualisationCanvas.height)
      }

    }
  }

  private getPrevisualisation(coords: Vec2, size: Vec2) : HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = size.x;
    canvas.height = size.y;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = 'white';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.fill();
    ctx.drawImage(this.drawingService.canvas, Math.max(0 - size.x/2, coords.x - size.x/2), Math.max(0 - size.y/2, coords.y - size.y/2),
                  Math.min(size.x, this.drawingService.canvas.width-coords.x-size.x/2),
                  Math.min(size.y, this.drawingService.canvas.height-coords.y-size.y/2), 0, 0, canvas.width, canvas.height);
    return canvas;
  }
}
