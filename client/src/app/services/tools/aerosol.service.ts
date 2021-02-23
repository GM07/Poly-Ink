import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { AerosolToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
export enum LeftMouse {
  Released = 0,
  Pressed = 1,
}

const SPRAY_INTERVAL_MS: number = 10;

@Injectable({
  providedIn: 'root'
})
export class AerosolService extends Tool {

  toolID: string = AerosolToolConstants.TOOL_ID;
  private mousePosition: Vec2;
  private mouseMoving: boolean;

  private areaDiameterIn: number = 10;
  private dropletDiameterIn: number = 0.5;
  public sprayIntervalID: number;
  private nDropletsPerSpray: number = this.areaDiameter;

  constructor(drawingService: DrawingService, colorService: ColorService) {
    super(drawingService, colorService);
    this.shortcutKey = AerosolToolConstants.SHORTCUT_KEY;
  }

  stopDrawing(): void {
    this.onMouseUp({} as MouseEvent);
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
  }

  set areaDiameter(diameter: number) {
    const max = 50;
    this.areaDiameterIn = Math.min(Math.max(diameter, 1), max);
  }

  set dropletDiameter(diameter: number) {
    const max = 25;
    this.dropletDiameterIn = Math.min(Math.max(diameter, 1), max);
  }

  get areaDiameter(): number {
    return this.areaDiameterIn;
  }
  
  get dropletDiameter(): number {
    return this.dropletDiameterIn;
  }

  onMouseDown(event: MouseEvent): void {
    this.mouseDown = event.button === MouseButton.Left;
    if (this.mouseDown) {
      this.mouseDownCoord = this.getPositionFromMouse(event);
      const mousePosition = this.mouseDownCoord;
      this.sprayContinuously(this.drawingService.previewCtx, mousePosition);
    }
  }

  onMouseUp(event: MouseEvent): void {
    if (this.mouseDown) {
      if (this.isInCanvas(event)) {
        this.mousePosition = this.getPositionFromMouse(event);
        this.drawSpray(this.drawingService.previewCtx, this.mousePosition);
      }
      // Copie du preview sur le base
      this.drawingService.baseCtx.drawImage(this.drawingService.previewCtx.canvas, 0, 0); 
    }
    this.mouseDown = false;
    window.clearInterval(this.sprayIntervalID);
    this.drawingService.clearCanvas(this.drawingService.previewCtx);
  }

  onMouseMove(event: MouseEvent): void {
    if (this.mouseDown) {
      window.clearInterval(this.sprayIntervalID);
      
      const mousePosition = this.getPositionFromMouse(event);
      this.drawSpray(this.drawingService.previewCtx, mousePosition);
      this.mouseMoving = false; 
      // Si la souris ne bouge plus, on doit spray quand même à intervalle régulier
      if (!this.mouseMoving) {
        this.sprayContinuously(this.drawingService.previewCtx, mousePosition);
      }
    } else {
      this.mouseDownCoord = this.getPositionFromMouse(event);
    }
  }
  
  onMouseLeave(event: MouseEvent): void {
    window.clearInterval(this.sprayIntervalID);
    if (!this.mouseDown) this.drawingService.clearCanvas(this.drawingService.previewCtx);
  }
  
  onMouseEnter(event: MouseEvent): void {
    if (event.button !== MouseButton.Left) return;
    
    if (event.buttons === LeftMouse.Pressed) {
      this.onMouseMove(event);
    } else if (event.buttons === LeftMouse.Released) {
      this.drawingService.clearCanvas(this.drawingService.previewCtx);
      this.drawingService.baseCtx.drawImage(this.drawingService.previewCtx.canvas, 0, 0);
      this.mouseDown = false;
    }
  }

  sprayContinuously(ctx: CanvasRenderingContext2D, mousePosition: Vec2): void {
    let self = this;
    this.sprayIntervalID = window.setInterval(function() { self.drawSpray(self.drawingService.previewCtx, mousePosition) }, SPRAY_INTERVAL_MS);
  }

  drawSpray(ctx: CanvasRenderingContext2D, mousePosition: Vec2): void {
    ctx.beginPath();
    ctx.fillStyle = this.colorService.primaryRgba;
    ctx.strokeStyle = this.colorService.primaryRgba;
    ctx.lineWidth = this.areaDiameter;
    ctx.lineCap = 'round' as CanvasLineCap;
    ctx.lineJoin = 'round' as CanvasLineJoin;

    for (let i = 0; i < this.nDropletsPerSpray; i++) {
      let randOffset: Vec2  = this.randomDroplet(); 

      let randX : number = mousePosition.x + randOffset.x;
      let randY : number = mousePosition.y + randOffset.y;
      ctx.arc(randX, randY, this.dropletDiameter, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.stroke();
    }
  }

  randomDroplet(): Vec2 { 
    let randAngle = Math.random() * 360;
    let randRadius = Math.random() * this.areaDiameter;

    return { 
      x: Math.cos(randAngle) * randRadius, 
      y: Math.sin(randAngle) * randRadius
    };
  }
}
