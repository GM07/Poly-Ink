import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '../drawing/drawing.service';

export enum Key {
    Released = 0,
    Pressed = 1,
}

export enum Mode {
    Contour = 0,
    Filled = 1,
    FilledWithContour = 2,
}

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private strokeStyle = 'black';
    private fillStyle = 'red';
    private mouseUpCoord: Vec2;
    private shiftPressed = false;
    private lineWidthIn: number = 5;
    mode: Mode = Mode.FilledWithContour;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.clearPath();
        this.shortCutKey = '1';
    }

    stopDrawing(): void {
        this.mouseDown = false;
        this.shiftPressed = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();
            this.mouseDownCoord = this.getPositionFromMouse(event);
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

    onKeyPress(event: KeyboardEvent): void {
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

    private drawRectangle(ctx: CanvasRenderingContext2D): void {
        let width: number = this.mouseUpCoord.x - this.mouseDownCoord.x;
        let height: number = this.mouseUpCoord.y - this.mouseDownCoord.y;
        if (this.shiftPressed) {
            height = Math.sign(height) * Math.max(Math.abs(width), Math.abs(height));
            width = Math.sign(width) * Math.abs(height);
        }
        ctx.lineWidth = this.lineWidthIn;
        ctx.strokeStyle = this.strokeStyle;
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath();

        switch (this.mode) {
            case Mode.Contour:
                ctx.strokeRect(this.mouseDownCoord.x, this.mouseDownCoord.y, width, height);
                break;
            case Mode.Filled:
                ctx.fillRect(this.mouseDownCoord.x, this.mouseDownCoord.y, width, height);
                break;
            case Mode.FilledWithContour:
                ctx.rect(this.mouseDownCoord.x, this.mouseDownCoord.y, width, height);
                ctx.fill();
                break;
            default:
                break;
        }

        ctx.stroke();
    }

    private updateRectangle() {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawRectangle(ctx);
    }

    private clearPath(): void {}
}
