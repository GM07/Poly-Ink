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

  private moveBottom : boolean;
  private moveRight : boolean;

  private canvasTop : number;
  private canvasLeft : number;
  @ViewChild('previewResize', { static: false }) previewResize: ElementRef<HTMLDivElement>;
  @ViewChild('control_right', { static: false }) control_right: ElementRef<HTMLDivElement>;
  @ViewChild('control_bottom', { static: false }) control_bottom: ElementRef<HTMLDivElement>;
  @ViewChild('control_corner', { static: false }) control_corner: ElementRef<HTMLDivElement>;


  constructor(private drawingService : DrawingService) {
    this.treshold = 15;
   }


  ngAfterViewInit(): void {
    this.previewResize.nativeElement.style.width = String(this.drawingService.canvas.width) + "px";
    this.previewResize.nativeElement.style.height = String(this.drawingService.canvas.height) + "px";
    this.setCanvasMargin();
    this.previewResize.nativeElement.style.marginLeft = String(this.canvasLeft) + "px";
    this.previewResize.nativeElement.style.marginTop = String(this.canvasTop) + "px";
    this.setCanvasControl();
  }


  @HostListener('document:mousemove', ['$event'])
   onMouseMove(event: MouseEvent): void {
      if((this.moveRight || this.moveBottom) && this.isDown){
        this.previewResize.nativeElement.style.width = this.moveRight ?
        String((event.clientX-this.canvasLeft) > 250 ? event.clientX-this.canvasLeft : 250) + "px" :
        this.previewResize.nativeElement.style.width;

        this.previewResize.nativeElement.style.height = this.moveBottom ?
        String((event.clientY-this.canvasTop) > 250 ? event.clientY - this.canvasTop : 250) + "px" :
        this.previewResize.nativeElement.style.height;
      }
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
      this.isDown = event.button == MouseButton.Left;
      if(this.isDown){
        this.closeEnough(event.clientX, event.clientY);
        if(this.moveBottom || this.moveRight)
          this.previewResize.nativeElement.style.visibility = "visible";
      }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
      this.isDown = !(this.isDown && event.button == MouseButton.Left);
      if(this.moveRight || this.moveBottom){
        let xModifier = this.moveRight ? event.clientX-this.canvasLeft : this.drawingService.canvas.width;
        let yModifier = this.moveBottom ? event.clientY-this.canvasTop : this.drawingService.canvas.height;
        this.resizeCanvas(xModifier, yModifier);

        this.setCanvasControl();
        this.previewResize.nativeElement.style.visibility = "hidden";
      }
    }


    //TODO make it fancier pls
    closeEnough(mouseX : number, mouseY : number) : void{
      this.setCanvasMargin();

      this.moveBottom = Math.abs(mouseY - (this.canvasTop + this.drawingService.canvas.height)) < this.treshold;
      this.moveRight = Math.abs(mouseX - (this.canvasLeft + this.drawingService.canvas.width)) < this.treshold
    }

    setCanvasMargin() : void{
      let canvasOffset = this.drawingService.canvas.getBoundingClientRect();
      let documentOffset = document.documentElement;

      this.canvasTop = canvasOffset.top + window.pageYOffset - documentOffset.clientTop;
      this.canvasLeft = canvasOffset.left + window.pageXOffset - documentOffset.clientLeft;
    }

    setCanvasControl() : void {
      this.control_corner.nativeElement.style.marginTop = String(this.drawingService.canvas.height - 2.5) + "px";
      this.control_corner.nativeElement.style.marginLeft = String(this.drawingService.canvas.width - 2.5) + "px";

      this.control_bottom.nativeElement.style.marginTop = String(this.drawingService.canvas.height - 2.5) + "px";
      this.control_bottom.nativeElement.style.marginLeft = String(this.drawingService.canvas.width/2 - 2.5) + "px";

      this.control_right.nativeElement.style.marginTop = String(this.drawingService.canvas.height/2 - 2.5) + "px";
      this.control_right.nativeElement.style.marginLeft = String(this.drawingService.canvas.width - 2.5) + "px";
    }

    resizeCanvas(width : number, height : number) : void{
      width = width < 250 ? 250 : width;
      height = height < 250 ? 250 : height;
      this.drawingService.resizeCanvas(width, height);
    }

    public getCanvasLeft() : number{
      return this.canvasLeft;
    }

    public getCanvasTop() : number{
      return this.canvasTop;
    }

    public getMoveBottom() : boolean{
      return this.moveBottom;
    }

    public getMoveRight() : boolean{
      return this.moveRight;
    }
}
