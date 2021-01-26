import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    previewCanvas : HTMLCanvasElement;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    resizeCanvas(width: number, height: number) : void {
        let memCanvas = document.createElement('canvas');
        let memCtx = memCanvas.getContext('2d');
        if(memCtx != null){
          memCanvas.width = this.canvas.width;
          memCanvas.height = this.canvas.height;
          memCtx.drawImage(this.canvas, 0,0)
          this.canvas.width = width;
          this.canvas.height = height;
          this.previewCanvas.width = width;
          this.previewCanvas.height = height;
          this.baseCtx.drawImage(memCanvas, 0, 0);
          if(memCanvas.width < this.canvas.width || memCanvas.height < this.canvas.height){
            this.baseCtx.fillStyle = "white";
            this.baseCtx.fillRect(memCanvas.width, 0, this.canvas.width - memCanvas.width, this.canvas.height);
            this.baseCtx.fillRect(0, memCanvas.height, this.canvas.width, this.canvas.height - memCanvas.height);
          }
        }
    }

    initBackground() : void {
      this.baseCtx.fillStyle = "white";
      this.baseCtx.fillRect(0,0,this.canvas.width, this.canvas.height)
    }
}
