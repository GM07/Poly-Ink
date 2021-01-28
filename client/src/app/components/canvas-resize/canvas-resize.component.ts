import { AfterViewInit, Component, HostListener} from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { canvasConst } from '@app/constants/canvas.ts';
import { controlConst } from '@app/constants/control.ts'

@Component({
    selector: 'app-canvas-resize',
    templateUrl: './canvas-resize.component.html',
    styleUrls: ['./canvas-resize.component.scss'],
})
export class CanvasResizeComponent implements AfterViewInit {
    private isDown: boolean;

    private moveBottom: boolean;
    private moveRight: boolean;

    private canvasTop: number;
    private canvasLeft: number;

    controlRightStyle : {'margin-top': String, 'margin-left': String};
    controlBottomStyle : {'margin-top': String, 'margin-left': String};
    controlCornerStyle : {'margin-top': String, 'margin-left': String};

    previewResizeStyle = {'visibility': 'hidden', //Déclaration des éléments que doit contenir ce tableau
                          'width': "0",
                          'height': "0",
                          'margin-left': "0",
                          'margin-top': "0"};

    constructor(private drawingService: DrawingService) {}

    ngAfterViewInit(): void {
        this.setCanvasMargin();
        this.setStylePreview();
        this.setStyleControl();
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if ((this.moveRight || this.moveBottom) && this.isDown) {
            this.previewResizeStyle['width'] = this.moveRight
                ? String(event.clientX - this.canvasLeft > canvasConst.MIN_WIDTH ? event.clientX - this.canvasLeft : canvasConst.MIN_WIDTH) + 'px'
                : this.previewResizeStyle['width'];

            this.previewResizeStyle['height'] = this.moveBottom
                ? String(event.clientY - this.canvasTop > canvasConst.MIN_HEIGHT ? event.clientY - this.canvasTop : canvasConst.MIN_HEIGHT) + 'px'
                : this.previewResizeStyle['height']
        }
    }

    @HostListener('document:mousedown', ['$event'])
    onMouseDown(event: MouseEvent): void {
        this.isDown = event.button === controlConst.MouseButton.Left;
        if (this.isDown) {
            this.closeEnough(event.clientX, event.clientY);
            if (this.moveBottom || this.moveRight) this.previewResizeStyle['visibility'] = 'visible';
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.isDown = !(this.isDown && event.button === controlConst.MouseButton.Left);
        if (this.moveRight || this.moveBottom) {
            const xModifier = this.moveRight ? event.clientX - this.canvasLeft : this.drawingService.canvas.width;
            const yModifier = this.moveBottom ? event.clientY - this.canvasTop : this.drawingService.canvas.height;
            this.resizeCanvas(xModifier, yModifier);

            this.setStyleControl();
            this.moveRight = this.moveBottom = false;
            this.previewResizeStyle['visibility'] = 'hidden';
        }
    }

    closeEnough(mouseX: number, mouseY: number): void {
        const TRESHOLD = 10;

        this.moveBottom =
            Math.abs(mouseY - (this.canvasTop + this.drawingService.canvas.height)) < TRESHOLD &&
            mouseX < this.canvasLeft + this.drawingService.canvas.width + TRESHOLD &&
            mouseX > this.canvasLeft - TRESHOLD;
        this.moveRight =
            Math.abs(mouseX - (this.canvasLeft + this.drawingService.canvas.width)) < TRESHOLD &&
            mouseY < this.canvasTop + this.drawingService.canvas.height + TRESHOLD &&
            mouseY > this.canvasTop - TRESHOLD;
    }

    setCanvasMargin(): void {
        const canvasOffset = this.drawingService.canvas.getBoundingClientRect();
        const documentOffset = document.documentElement;

        this.canvasTop = canvasOffset.top + window.pageYOffset - documentOffset.clientTop;
        this.canvasLeft = canvasOffset.left + window.pageXOffset - documentOffset.clientLeft;
    }

    resizeCanvas(width: number, height: number): void {
        this.drawingService.resizeCanvas(width < canvasConst.MIN_WIDTH ? canvasConst.MIN_WIDTH : width, height < canvasConst.MIN_HEIGHT ? canvasConst.MIN_HEIGHT : height);
    }

    setStyleControl() : void{
      setTimeout(() => { //Attend la fin de la queue avant d'exécuter cette fonction. Laisse le temps au canvas de s'instancier
        this.controlRightStyle = {
         'margin-top': String(this.drawingService.canvas.height / 2 - canvasConst.CONTROL_MARGIN) + 'px',
         'margin-left': String(this.drawingService.canvas.width - canvasConst.CONTROL_MARGIN) + 'px',
        };
        this.controlBottomStyle = {
         'margin-top': String(this.drawingService.canvas.height - canvasConst.CONTROL_MARGIN) + 'px',
          'margin-left': String(this.drawingService.canvas.width / 2 - canvasConst.CONTROL_MARGIN) + 'px',
        };
        this.controlCornerStyle = {
         'margin-top': String(this.drawingService.canvas.height - canvasConst.CONTROL_MARGIN) + 'px',
          'margin-left': String(this.drawingService.canvas.width - canvasConst.CONTROL_MARGIN) + 'px',
        };
      });
    }

    setStylePreview() : void {
      setTimeout(() => {
        this.previewResizeStyle = {
          'width': String(this.drawingService.canvas.width) + 'px',
          'height': String(this.drawingService.canvas.height) + 'px',
          'margin-left': String(this.canvasLeft) + 'px',
          'margin-top': String(this.canvasTop) + 'px',
          'visibility': 'hidden',
        };
      });
    }

    getCanvasLeft(): number {
      return this.canvasLeft;
  }

  getCanvasTop(): number {
      return this.canvasTop;
  }
}
