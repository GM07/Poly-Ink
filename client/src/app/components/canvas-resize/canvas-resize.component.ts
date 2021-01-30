import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CanvasConst } from '@app/constants/canvas.ts';
import { DrawingService } from '@app/services/drawing/drawing.service';

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

    controlBottomStyle: { [key: string]: string };
    controlCornerStyle: { [key: string]: string };
    controlRightStyle: { [key: string]: string };

    previewResizeStyle: { [key: string]: string };
    @ViewChild('previewResize', { static: false }) previewResize: ElementRef<HTMLDivElement>;

    constructor(private drawingService: DrawingService) {
        this.previewResizeStyle = {
            'margin-left': '0',
            'margin-top': '0',
        };
    }

    ngAfterViewInit(): void {
        this.setCanvasMargin();
        this.setStylePreview();
        this.setStyleControl();
    }

    mouseDown(right : boolean, bottom: boolean) : void {
      this.isDown = true;
      this.moveRight = right;
      this.moveBottom = bottom;
      this.previewResize.nativeElement.style.visibility = 'visible'
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isDown) {
            if (this.moveRight)
                this.previewResizeStyle.width = String(this.getWidth(event.clientX)) + 'px';
            if (this.moveBottom)
                this.previewResizeStyle.height = String(this.getHeight(event.clientY)) + 'px';
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.isDown = false;
        const xModifier = this.moveRight ? this.getWidth(event.clientX) : this.drawingService.canvas.width;
        const yModifier = this.moveBottom ? this.getHeight(event.clientY) : this.drawingService.canvas.height;
        this.drawingService.resizeCanvas(xModifier, yModifier);

        this.setStyleControl();
        this.moveRight = this.moveBottom = false;

        this.previewResize.nativeElement.style.visibility = 'hidden';
    }

    setCanvasMargin(): void {
        const canvasOffset = this.drawingService.canvas.getBoundingClientRect();
        const documentOffset = document.documentElement;

        this.canvasTop = canvasOffset.top + window.pageYOffset - documentOffset.clientTop;
        this.canvasLeft = canvasOffset.left + window.pageXOffset - documentOffset.clientLeft - 1;
    }

    resizeCanvas(xModifier: number, yModifier : number) : void {
      this.drawingService.resizeCanvas(xModifier < 250 ? 250 : xModifier, yModifier < 250 ? 250 : yModifier);
    }

    setStyleControl(): void {
        setTimeout(() => {
            // Attend la fin de la queue avant d'exécuter cette fonction. Laisse le temps au canvas de s'instancier
            this.controlRightStyle = {
                'margin-top': String(this.drawingService.canvas.height / 2 - CanvasConst.CONTROL_MARGIN) + 'px',
                'margin-left': String(this.drawingService.canvas.width - CanvasConst.CONTROL_MARGIN) + 'px',
            };
            this.controlBottomStyle = {
                'margin-top': String(this.drawingService.canvas.height - CanvasConst.CONTROL_MARGIN) + 'px',
                'margin-left': String(this.drawingService.canvas.width / 2 - CanvasConst.CONTROL_MARGIN) + 'px',
            };
            this.controlCornerStyle = {
                'margin-top': String(this.drawingService.canvas.height - CanvasConst.CONTROL_MARGIN) + 'px',
                'margin-left': String(this.drawingService.canvas.width - CanvasConst.CONTROL_MARGIN) + 'px',
            };
        });
    }

    setStylePreview(): void {
        setTimeout(() => {
            this.previewResizeStyle = {
                'margin-left': String(this.canvasLeft) + 'px',
                'margin-top': String(this.canvasTop) + 'px',
            };
            this.previewResize.nativeElement.style.width = String(this.drawingService.canvas.width) + 'px'; // lint lance une erreur si width et heig
            this.previewResize.nativeElement.style.height = String(this.drawingService.canvas.height) + 'px'; // sont dans previewresizestyle
        });
    }

    getCanvasLeft(): number {
        return this.canvasLeft;
    }

    getCanvasTop(): number {
        return this.canvasTop;
    }

    getWidth(xPos : number) : number{
      return xPos - this.canvasLeft > CanvasConst.MIN_WIDTH ? xPos - this.canvasLeft : CanvasConst.MIN_WIDTH
    }

    getHeight(yPos : number) : number{
      return yPos - this.canvasTop > CanvasConst.MIN_HEIGHT ? yPos - this.canvasTop : CanvasConst.MIN_HEIGHT
    }
}
