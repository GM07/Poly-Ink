import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { PolygoneToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { ColorService } from 'src/color-picker/services/color.service';
import { DrawingService } from '../drawing/drawing.service';

export enum PolygoneMode {
    Contour = 0,
    Filled = 1,
    FilledWithContour = 2,
}

@Injectable({
    providedIn: 'root',
})
export class PolygoneService extends Tool {
    toolID: string = PolygoneToolConstants.TOOL_ID;
    private shiftPressed: boolean;
    private lineWidthIn: number;
    polygoneMode: PolygoneMode;
    private numEdgesIn: number;
    private mouseUpCoord: Vec2;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = PolygoneToolConstants.SHORTCUT_KEY;
        // this.shiftPressed = false;
        this.lineWidthIn = 1;
        this.numEdgesIn = 3;
        this.polygoneMode = PolygoneMode.FilledWithContour;
    }

    set contourWidth(width: number) {
        const max = 50;
        this.lineWidthIn = Math.min(Math.max(width, 1), max);
    }

    set numEdges(numEdges: number) {
        if (numEdges >= ToolSettingsConst.MIN_NUM_EDGES && numEdges <= ToolSettingsConst.MAX_NUM_EDGES) {
            this.numEdgesIn = numEdges;
        }
    }

    get numEdges() {
        return this.numEdgesIn;
    }

    get contourWidth(): number {
        return this.lineWidthIn;
    }

    stopDrawing(): void {
        this.mouseDown = false;
        // this.shiftPressed = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.mouseUpCoord = this.mouseDownCoord;
            const ctx = this.drawingService.previewCtx;
            this.drawPolygone(ctx);
        }
    }
    onMouseUp(event: MouseEvent): void {
        if (this.mouseDown) {
            if (this.isInCanvas(event)) {
                this.mouseUpCoord = this.getPositionFromMouse(event);
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            const ctx = this.drawingService.previewCtx;
            this.drawingService.clearCanvas(ctx);
            this.drawPolygone(ctx);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            this.updatePolygone();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            this.updatePolygone();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (event.shiftKey && !this.shiftPressed) {
            this.shiftPressed = true;
            if (this.mouseDown) {
                this.updatePolygone();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (!event.shiftKey && this.shiftPressed) {
            this.shiftPressed = false;
            if (this.mouseDown) {
                this.updatePolygone();
            }
        }
    }

    private updatePolygone(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawPolygone(ctx);
    }

    private drawPolygone(ctx: CanvasRenderingContext2D): void {
        let radiusX: number = (this.mouseUpCoord.x - this.mouseDownCoord.x) / 2;
        let radiusY: number = (this.mouseUpCoord.y - this.mouseDownCoord.y) / 2;
        let radius: number = Math.min(radiusX, radiusY);
        let centerX: number = this.mouseDownCoord.x + radius;
        let centerY: number = this.mouseDownCoord.y + radius;

        let radiusAbs = Math.abs(radius);

        if (ctx === this.drawingService.previewCtx) {
            this.drawCirclePerimeter(ctx, centerX, centerY, radiusAbs);
        }

        // ctx.strokeStyle = this.colorService.secondaryRgba;
        // ctx.lineCap = 'round' as CanvasLineCap;
        // ctx.lineJoin = 'round' as CanvasLineJoin;

        // ctx.beginPath();
        // switch (this.polygoneMode) {
        //     case PolygoneMode.Contour:
        //         ctx.lineWidth = this.lineWidthIn;
        //         ctx.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
        //         ctx.stroke();
        //         break;
        //     case PolygoneMode.Filled:
        //         ctx.lineWidth = 0;
        //         ctx.fillStyle = this.colorService.primaryRgba;
        //         ctx.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
        //         ctx.fill();
        //         break;
        //     case PolygoneMode.FilledWithContour:
        //         ctx.lineWidth = this.lineWidthIn;
        //         ctx.fillStyle = this.colorService.primaryRgba;
        //         ctx.ellipse(centerX, centerY, radiusXAbs, radiusYAbs, 0, 0, 2 * Math.PI);
        //         ctx.fill();
        //         ctx.stroke();
        //         break;
        //     default:
        //         break;
        // }

        ctx.closePath();
    }
    private drawCirclePerimeter(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radiusAbs: number): void {
        const dashWidth = 1;
        // let lineWidth: number = this.lineWidthIn;
        // if (this.polygoneMode === PolygoneMode.Filled) {
        //     lineWidth = 0;
        // }
        console.log('Drawing');
        const lineDash = 6;
        ctx.lineWidth = dashWidth;
        ctx.strokeStyle = 'gray';
        ctx.setLineDash([lineDash]);
        ctx.beginPath();
        console.log(centerX, centerY, radiusAbs);
        ctx.arc(centerX, centerY, radiusAbs, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
        ctx.setLineDash([]);
    }
}
