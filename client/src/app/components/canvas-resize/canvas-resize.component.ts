import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ResizeDraw } from '@app/classes/commands/resize-draw';
import { ResizeConfig } from '@app/classes/tool-config/resize-config';
import { CanvasConst } from '@app/constants/canvas.ts';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ShortcutHandlerService } from '@app/services/shortcut/shortcut-handler.service';

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

    constructor(private drawingService: DrawingService, private cd: ChangeDetectorRef, private shortcutHandler: ShortcutHandlerService) {
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

        this.drawingService.changes.subscribe(() => this.resetCanvas());
    }

    mouseDown(right: boolean, bottom: boolean): void {
        this.drawingService.blockUndoRedo();
        this.previewResizeView = true;
        this.isDown = true;
        this.moveRight = right;
        this.moveBottom = bottom;
        this.shortcutHandler.blockShortcuts = true;
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
        const xModifier = this.moveRight ? this.getWidth(event.pageX) : this.drawingService.canvas.width;
        const yModifier = this.moveBottom ? this.getHeight(event.pageY) : this.drawingService.canvas.height;
        if (this.moveBottom || this.moveRight) this.resizeCanvas(xModifier, yModifier);

        this.setStyleControl();
        this.moveRight = this.moveBottom = false;

        this.previewResizeView = false;
        if (this.isDown) this.shortcutHandler.blockShortcuts = false;
        this.isDown = false;
    }

    resizeCanvas(xModifier: number, yModifier: number): void {
        const config = new ResizeConfig();

        config.width = Math.max(xModifier, CanvasConst.MIN_WIDTH);
        config.height = Math.max(yModifier, CanvasConst.MIN_HEIGHT);

        const command = new ResizeDraw(config, this.drawingService);
        this.drawingService.draw(command);
    }

    private resetCanvas(): void {
        this.setStyleControl();
        this.setStylePreview();
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

    private setCanvasMargin(): void {
        const canvasOffset = this.drawingService.canvas.getBoundingClientRect();
        const documentOffset = document.documentElement;

        this.canvasTop = canvasOffset.top + window.pageYOffset - documentOffset.clientTop;
        this.canvasLeft = canvasOffset.left + window.pageXOffset - documentOffset.clientLeft;
    }

    private setStyleControl(): void {
        this.controlRightStyle = {
            'margin-top': String(this.drawingService.canvas.height / 2) + 'px',
            'margin-left': String(this.drawingService.canvas.width) + 'px',
        };
        this.controlBottomStyle = {
            'margin-top': String(this.drawingService.canvas.height) + 'px',
            'margin-left': String(this.drawingService.canvas.width / 2) + 'px',
        };
        this.controlCornerStyle = {
            'margin-top': String(this.drawingService.canvas.height) + 'px',
            'margin-left': String(this.drawingService.canvas.width) + 'px',
        };
    }

    private setStylePreview(): void {
        const borderWidth: string = window.getComputedStyle(this.drawingService.canvas).getPropertyValue('border-left-width');
        const borderSize: number = parseInt(borderWidth.replace('px', ''), 10);
        this.previewResizeStyle = {
            'margin-left': String(this.canvasLeft) + 'px',
            'margin-top': String(this.canvasTop) + 'px',
            // prettier-ignore
            'width': String(this.drawingService.canvas.width+borderSize) + 'px',
            'height': String(this.drawingService.canvas.height+borderSize) + 'px',
            // prettier-ignore
        };
        this.workZoneStyle = {
            // prettier-ignore
            width: String(this.drawingService.canvas.width + CanvasConst.WORKING_SIZE) + 'px',
            height: String(this.drawingService.canvas.height + CanvasConst.WORKING_SIZE) + 'px',
            // prettier-ignore
        };
    }
}
