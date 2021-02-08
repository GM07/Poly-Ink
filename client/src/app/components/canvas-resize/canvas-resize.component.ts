import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { CanvasConst } from '@app/constants/canvas.ts';
import { NewDrawingService } from '@app/services/drawing/canvas-reset.service';
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

    workZoneStyle: { [key: string]: string };

    previewResizeView: boolean;
    previewResizeStyle: { [key: string]: string };
    @ViewChild('previewResize', { static: false }) previewResize: ElementRef<HTMLDivElement>;

    constructor(private drawingService: DrawingService, private cd: ChangeDetectorRef, private newDrawing: NewDrawingService) {
        this.previewResizeView = false;
        this.previewResizeStyle = {
            'margin-left': '0',
            'margin-top': '0',
        };
        document.documentElement.style.backgroundColor = 'lightgray';
    }

    ngAfterViewInit(): void {
        this.setCanvasMargin();
        this.resetCanvas();
        this.cd.detectChanges();

        this.newDrawing.changes.subscribe((value: number) => this.resetCanvas());
    }

    mouseDown(right: boolean, bottom: boolean): void {
        this.previewResizeView = true;
        this.isDown = true;
        this.moveRight = right;
        this.moveBottom = bottom;
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        if (this.isDown) {
            if (this.moveRight) {
                this.previewResizeStyle.width = String(this.getWidth(event.pageX)) + 'px';
                this.workZoneStyle.width = String(this.getWidth(event.pageX + CanvasConst.WORKING_SIZE)) + 'px';
            }
            if (this.moveBottom) {
                this.previewResizeStyle.height = String(this.getHeight(event.pageY)) + 'px';
                this.workZoneStyle.height = String(this.getHeight(event.pageY + CanvasConst.WORKING_SIZE)) + 'px';
            }
        }
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.isDown = false;
        const xModifier = this.moveRight ? this.getWidth(event.pageX) : this.drawingService.canvas.width;
        const yModifier = this.moveBottom ? this.getHeight(event.pageY) : this.drawingService.canvas.height;
        if (this.moveBottom || this.moveRight) this.drawingService.resizeCanvas(xModifier, yModifier);

        this.setStyleControl();
        this.moveRight = this.moveBottom = false;

        this.previewResizeView = false;
    }

    setCanvasMargin(): void {
        const canvasOffset = this.drawingService.canvas.getBoundingClientRect();
        const documentOffset = document.documentElement;

        this.canvasTop = canvasOffset.top + window.pageYOffset - documentOffset.clientTop;
        this.canvasLeft = canvasOffset.left + window.pageXOffset - documentOffset.clientLeft;
    }

    resizeCanvas(xModifier: number, yModifier: number): void {
        this.drawingService.resizeCanvas(
            xModifier < CanvasConst.MIN_WIDTH ? CanvasConst.MIN_WIDTH : xModifier,
            yModifier < CanvasConst.MIN_HEIGHT ? CanvasConst.MIN_HEIGHT : yModifier,
        );
    }

    resetCanvas(): void {
        this.setStyleControl();
        this.setStylePreview();
    }

    setStyleControl(): void {
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
    }

    setStylePreview(): void {
        this.previewResizeStyle = {
            'margin-left': String(this.canvasLeft) + 'px',
            'margin-top': String(this.canvasTop) + 'px',
            // prettier-ignore
            'width': String(this.drawingService.canvas.width) + 'px',
            'height': String(this.drawingService.canvas.height) + 'px',
            // prettier-ignore
        };
        this.workZoneStyle = {
            // prettier-ignore
            width: String(this.drawingService.canvas.width + CanvasConst.WORKING_SIZE) + 'px',
            height: String(this.drawingService.canvas.height + CanvasConst.WORKING_SIZE) + 'px',
            // prettier-ignore
        };
    }

    getCanvasLeft(): number {
        return this.canvasLeft;
    }

    getCanvasTop(): number {
        return this.canvasTop;
    }

    getWidth(xPos: number): number {
        return xPos - this.canvasLeft > CanvasConst.MIN_WIDTH ? xPos - this.canvasLeft : CanvasConst.MIN_WIDTH;
    }

    getHeight(yPos: number): number {
        return yPos - this.canvasTop > CanvasConst.MIN_HEIGHT ? yPos - this.canvasTop : CanvasConst.MIN_HEIGHT;
    }
}
