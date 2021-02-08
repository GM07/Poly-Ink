import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/components/color-picker/color.service';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';

export enum Key {
    Released = 0,
    Pressed = 1,
}

export enum RectangleMode {
    Contour = 0,
    Filled = 1,
    FilledWithContour = 2,
}

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private mouseUpCoord: Vec2;
    private shiftPressed: boolean;
    private lineWidthIn: number;
    rectangleMode: RectangleMode;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortCutKey = '1';
        this.shiftPressed = false;
        this.lineWidthIn = 1;
        this.rectangleMode = RectangleMode.FilledWithContour;
    }

    set contourWidth(width: number) {
        const max = 100;
        this.lineWidthIn = Math.min(Math.max(width, 1), max);
    }

    get contourWidth(): number {
        return this.lineWidthIn;
    }

    stopDrawing(): void {
        this.mouseDown = false;
        this.shiftPressed = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.mouseUpCoord = this.mouseDownCoord;
            this.drawRectangle(this.drawingService.previewCtx);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.isInCanvas(event)) {
                this.mouseUpCoord = this.getPositionFromMouse(event);
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawRectangle(this.drawingService.baseCtx);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            const ctx = this.drawingService.previewCtx;
            this.drawingService.clearCanvas(ctx);
            this.drawRectangle(ctx);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            this.updateRectangle();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            this.updateRectangle();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.shiftKey && !this.shiftPressed) {
            this.shiftPressed = true;
            if (this.mouseDown) {
                this.updateRectangle();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (!event.shiftKey && this.shiftPressed) {
            this.shiftPressed = false;
            if (this.mouseDown) {
                this.updateRectangle();
            }
        }
    }

    private updateRectangle(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawRectangle(ctx);
    }

    private drawRectangle(ctx: CanvasRenderingContext2D): void {
        let width: number = this.mouseUpCoord.x - this.mouseDownCoord.x;
        let height: number = this.mouseUpCoord.y - this.mouseDownCoord.y;
        if (this.shiftPressed) {
            height = Math.sign(height) * Math.max(Math.abs(width), Math.abs(height));
            width = Math.sign(width) * Math.abs(height);
        }
        ctx.lineWidth = this.lineWidthIn;
        ctx.strokeStyle = this.colorService.secondaryRgba;
        ctx.fillStyle = this.colorService.primaryRgba;
        ctx.beginPath();

        switch (this.rectangleMode) {
            case RectangleMode.Contour:
                ctx.strokeRect(this.mouseDownCoord.x, this.mouseDownCoord.y, width, height);
                break;
            case RectangleMode.Filled:
                ctx.fillRect(this.mouseDownCoord.x, this.mouseDownCoord.y, width, height);
                break;
            case RectangleMode.FilledWithContour:
                ctx.rect(this.mouseDownCoord.x, this.mouseDownCoord.y, width, height);
                ctx.fill();
                break;
            default:
                break;
        }

        ctx.stroke();
        ctx.closePath();
    }
}
