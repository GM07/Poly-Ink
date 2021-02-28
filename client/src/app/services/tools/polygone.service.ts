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
        this.numEdgesIn = ToolSettingsConst.MIN_NUM_EDGES;
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
            this.drawPolygone(this.drawingService.baseCtx);
        }
        this.mouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            const ctx = this.drawingService.previewCtx;
            this.drawingService.clearCanvas(ctx);
            this.drawPolygone(ctx);
            console.log(event.x, event.y);
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
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;


        if (ctx === this.drawingService.previewCtx) {
            this.drawCirclePerimeter(ctx, centerX, centerY, radiusAbs);
        }

        this.drawPolygoneSides(ctx, centerX, centerY, radiusAbs);
        ctx.closePath();
    }

    private drawPolygoneSides(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radiusAbs: number) {
        let angle = 2*Math.PI / this.numEdgesIn;
        let startingAngle = this.numEdgesIn === ToolSettingsConst.NUM_EDGES_SQUARE ? (-Math.PI / 2) / 2 : -Math.PI / 2;
        ctx.lineWidth =  this.polygoneMode === PolygoneMode.Filled ? 0 : this.lineWidthIn;
        let lineWidthWeightedRadius = radiusAbs - ctx.lineWidth / 2; 

        ctx.beginPath();
        for(let i = 0; i < this.numEdges; i++) {
            let currentX = centerX + lineWidthWeightedRadius * Math.cos(startingAngle + i * angle);
            let currentY = centerY + lineWidthWeightedRadius * Math.sin(startingAngle + i * angle);
            ctx.lineTo(currentX, currentY);
        }
        ctx.closePath();

        ctx.strokeStyle = this.colorService.secondaryRgba;
        ctx.fillStyle = this.colorService.primaryRgba;
        if (this.polygoneMode === PolygoneMode.Filled || this.polygoneMode === PolygoneMode.FilledWithContour) {
            ctx.fill();
        } 
        if (this.polygoneMode === PolygoneMode.Contour || this.polygoneMode === PolygoneMode.FilledWithContour) {
            ctx.stroke();
        }
    }


    private drawCirclePerimeter(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radiusAbs: number): void {
        const dashWidth = 1;
        const lineDash = 6;
        ctx.lineWidth = dashWidth;
        ctx.strokeStyle = 'gray';
        ctx.setLineDash([lineDash]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, radiusAbs, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.closePath();
        ctx.setLineDash([]);
    }
}
