import { Component, AfterViewInit, HostListener, ViewChild, ElementRef} from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';

//TODO devrait être dans un fichier const séparé
export enum MouseButton {
  Left = 0,
  Middle = 1,
  Right = 2,
  Back = 3,
  Forward = 4,
}

@Component({
  selector: 'app-canvas-resize',
  templateUrl: './canvas-resize.component.html',
  styleUrls: ['./canvas-resize.component.scss']
})
export class CanvasResizeComponent implements AfterViewInit {
  private treshold : number;
  private isDown : boolean;
  private side : number;
  private canvasTop : number;
  private canvasLeft : number;
  @ViewChild('previewResize', { static: false }) previewResize: ElementRef<HTMLDivElement>;


  constructor(private drawingService : DrawingService) {
    this.treshold = 15;

   }

  ngAfterViewInit(): void {
    this.previewResize.nativeElement.style.width = String(this.drawingService.canvas.width) + "px";
    this.previewResize.nativeElement.style.height = String(this.drawingService.canvas.height) + "px";
    this.setCanvasMargin();
    this.previewResize.nativeElement.style.marginLeft = String(this.canvasLeft) + "px";
    this.previewResize.nativeElement.style.marginTop = String(this.canvasTop) + "px";
  }


  @HostListener('document:mousemove', ['$event'])
   onMouseMove(event: MouseEvent): void {
      if(this.side != 0 && this.isDown){
        switch(this.side){
          case 1:
            this.previewResize.nativeElement.style.width = String((event.clientX-this.canvasLeft) > 250 ? event.clientX-this.canvasLeft : 250) + "px";
            break;
          case 2:
            this.previewResize.nativeElement.style.height = String((event.clientY-this.canvasTop) > 250 ? event.clientY - this.canvasTop : 250) + "px";
            break;
          case 3:
            this.previewResize.nativeElement.style.width = String((event.clientX-this.canvasLeft) > 250 ? event.clientX-this.canvasLeft : 250) + "px";
            this.previewResize.nativeElement.style.height = String((event.clientY-this.canvasTop) > 250 ? event.clientY - this.canvasTop : 250) + "px";
            break;
        }
      }
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
      this.isDown = event.button == MouseButton.Left;
      if((this.side = this.closeEnough(event.clientX, event.clientY)) && this.isDown){
      }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
      this.isDown = !(this.isDown && event.button == MouseButton.Left);
      if(this.side != 0){
        switch(this.side){
          case 1:
            this.drawingService.resizeCanvas((event.clientX-this.canvasLeft) > 250 ? event.clientX-this.canvasLeft : 250, this.drawingService.canvas.height);
            break;
          case 2:
            this.drawingService.resizeCanvas(this.drawingService.canvas.width, (event.clientY-this.canvasTop) > 250 ? event.clientY - this.canvasTop : 250);
            break;
          case 3:
            this.drawingService.resizeCanvas((event.clientX-this.canvasLeft) > 250 ? event.clientX-this.canvasLeft : 250, (event.clientY-this.canvasTop) > 250 ? event.clientY - this.canvasTop : 250);
            break;
        }
        this.side = 0;

      }
    }


    //TODO make it fancier pls
    closeEnough(mouseX : number, mouseY : number) : number{
      this.setCanvasMargin();

      let left = Math.abs(mouseY - (this.canvasTop + this.drawingService.canvas.height)) < this.treshold;
      let bottom = Math.abs(mouseX - (this.canvasLeft + this.drawingService.canvas.width)) < this.treshold

      if(left && bottom)
        return 3;
      if(left)
        return 2;
      if(bottom)
        return 1;
      return 0;
    }

    setCanvasMargin() : void{
      let canvasOffset = this.drawingService.canvas.getBoundingClientRect();
      let documentOffset = document.documentElement;

      this.canvasTop = canvasOffset.top + window.pageYOffset - documentOffset.clientTop;
      this.canvasLeft = canvasOffset.left + window.pageXOffset - documentOffset.clientLeft;
    }
}
