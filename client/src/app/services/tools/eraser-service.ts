import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { EraserToolConstants } from '@app/classes/tool_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control.ts';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';

export enum LeftMouse {
    Released = 0,
    Pressed = 1,
}

@Injectable({
    providedIn: 'root',
})
export class EraserService extends Tool {
    private pathData: Vec2[][];
    private lineWidthIn: number = 25;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.clearPath();
        this.shortcutKey = EraserToolConstants.SHORTCUTKEY;
        this.toolID = EraserToolConstants.TOOL_ID;
    }

    get lineWidth(): number {
        return this.lineWidthIn;
    }

    /**
     * La taille se choisit par pixel, donc un arrondissement
     * est fait pour avoir une valeur entière
     */
    set lineWidth(width: number) {
        this.lineWidthIn = Math.max(Math.round(width), 1);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.clearPath();

            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.pathData[this.pathData.length - 1].push(this.mouseDownCoord);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.isInCanvas(event)) {
                const mousePosition = this.getPositionFromMouse(event);
                this.pathData[this.pathData.length - 1].push(mousePosition);
            }
            this.drawLine(this.drawingService.baseCtx, this.pathData);
        }
        this.mouseDown = false;
        this.clearPath();
    }

    onMouseMove(event: MouseEvent): void {
        this.drawBackgroundPoint(this.getPositionFromMouse(event), true);

        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData[this.pathData.length - 1].push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
            this.drawBackgroundPoint(this.getPositionFromMouse(event), false);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (!this.mouseDown) this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseEnter(event: MouseEvent): void {
        if (event.button !== MouseButton.Left) return;

        if (event.buttons === LeftMouse.Pressed) {
            this.pathData.push([]);
            this.onMouseMove(event);
        } else if (event.buttons === LeftMouse.Released) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.baseCtx, this.pathData);
            this.mouseDown = false;
            this.clearPath();
        }
    }

    stopDrawing(): void {
        this.onMouseUp({} as MouseEvent);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    private drawBackgroundPoint(point: Vec2, clear: boolean): void {
        const ctx = this.drawingService.previewCtx;
        if (clear) this.drawingService.clearCanvas(ctx);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.fillRect(point.x - this.lineWidthIn / 2, point.y - this.lineWidthIn / 2, this.lineWidthIn, this.lineWidthIn);
        ctx.rect(point.x - this.lineWidthIn / 2, point.y - this.lineWidthIn / 2, this.lineWidthIn, this.lineWidthIn);
        ctx.stroke();
    }

    private drawLine(ctx: CanvasRenderingContext2D, pathData: Vec2[][]): void {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'square' as CanvasLineCap;
        ctx.lineJoin = 'bevel' as CanvasLineJoin;

        for (const paths of pathData) {
            for (const point of paths) {
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
            ctx.beginPath();
        }
        ctx.stroke();
    }

    private clearPath(): void {
        this.pathData = [];
        this.pathData.push([]);
    }
}
