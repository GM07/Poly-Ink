import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';

export enum EllipseMode {
    Contour = 0,
    Filled = 1,
    FilledWithContour = 2,
}

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    private strokeStyleIn: string;
    private fillStyleIn: string;
    private mouseUpCoord: Vec2;
    private shiftPressed: boolean;
    private lineWidthIn: number;
    ellipseMode: EllipseMode;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortCutKey = '2';
        this.strokeStyleIn = 'black';
        this.fillStyleIn = 'black';
        this.shiftPressed = false;
        this.lineWidthIn = 1;
        this.ellipseMode = EllipseMode.Contour;
    }

    set strokeStyle(color: string) {
        if (Tool.isColorValid(color)) this.strokeStyleIn = color;
    }

    get strokeStyle(): string {
        return this.strokeStyleIn;
    }

    set fillStyle(color: string) {
        if (Tool.isColorValid(color)) this.fillStyleIn = color;
    }

    get fillStyle(): string {
        return this.fillStyleIn;
    }

    set contourWidth(width: number) {
        const max = 50;
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
            const ctx = this.drawingService.previewCtx;
            this.drawEllipse(ctx);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.isInCanvas(event)) {
                this.mouseUpCoord = this.getPositionFromMouse(event);
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawEllipse(this.drawingService.baseCtx);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            const ctx = this.drawingService.previewCtx;
            this.drawingService.clearCanvas(ctx);
            this.drawEllipse(ctx);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            this.updateEllipse();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            this.updateEllipse();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.shiftKey && !this.shiftPressed) {
            this.shiftPressed = true;
            if (this.mouseDown) {
                this.updateEllipse();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (!event.shiftKey && this.shiftPressed) {
            this.shiftPressed = false;
            if (this.mouseDown) {
                this.updateEllipse();
            }
        }
    }

    private updateEllipse(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawEllipse(ctx);
    }

    private drawEllipse(ctx: CanvasRenderingContext2D): void {
        let radiusX: number = (this.mouseUpCoord.x - this.mouseDownCoord.x) / 2;
        let radiusY: number = (this.mouseUpCoord.y - this.mouseDownCoord.y) / 2;
        let centerX: number = this.mouseDownCoord.x + radiusX;
        let centerY: number = this.mouseDownCoord.y + radiusY;

        if (this.shiftPressed) {
            const minRadius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
            centerX = this.mouseDownCoord.x + Math.sign(radiusX) * minRadius;
            centerY = this.mouseDownCoord.y + Math.sign(radiusY) * minRadius;
            radiusX = minRadius;
            radiusY = minRadius;
        }

        const radiusXAbs = Math.abs(radiusX);
        const radiusYAbs = Math.abs(radiusY);

        if (ctx === this.drawingService.previewCtx) {
            this.drawRectanglePerimeter(ctx, centerX, centerY, radiusXAbs, radiusYAbs);
        }

        ctx.strokeStyle = this.strokeStyleIn;
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;

        ctx.beginPath();
        switch (this.ellipseMode) {
            case EllipseMode.Contour:
                ctx.lineWidth = this.lineWidthIn;
                ctx.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
                ctx.stroke();
                break;
            case EllipseMode.Filled:
                ctx.lineWidth = 0;
                ctx.fillStyle = this.fillStyleIn;
                ctx.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case EllipseMode.FilledWithContour:
                ctx.lineWidth = this.lineWidthIn;
                ctx.fillStyle = this.fillStyleIn;
                ctx.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                break;
            default:
                break;
        }

        ctx.closePath();
    }

    private drawRectanglePerimeter(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radiusX: number, radiusY: number): void {
        const dashWidth = 1;
        let lineWidth: number = this.lineWidthIn;
        if (this.ellipseMode === EllipseMode.Filled) {
            lineWidth = 0;
        }
        const x = centerX - radiusX - lineWidth / 2;
        const y = centerY - radiusY - lineWidth / 2;
        const width = radiusX * 2 + lineWidth;
        const height = radiusY * 2 + lineWidth;

        const lineDash = 6;
        ctx.lineWidth = dashWidth;
        ctx.strokeStyle = 'dark gray';
        ctx.setLineDash([lineDash]);
        ctx.beginPath();
        ctx.strokeRect(x, y, width, height);
        ctx.stroke();
        ctx.closePath();
        ctx.setLineDash([]);
    }
}
