import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { PolygoneToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';

export enum PolygoneMode {
    Contour = 0,
    Filled = 1,
    FilledWithContour = 2,
}

@Injectable({
    providedIn: 'root',
})
export class PolygoneService extends Tool {
    toolID: string;
    private lineWidthIn: number;
    polygoneMode: PolygoneMode;
    private numEdgesIn: number;
    private mouseUpCoord: Vec2;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(PolygoneToolConstants.SHORTCUT_KEY);
        this.toolID = PolygoneToolConstants.TOOL_ID;
        this.lineWidthIn = 1;
        this.numEdgesIn = ToolSettingsConst.MIN_NUM_EDGES;
        this.polygoneMode = PolygoneMode.FilledWithContour;
    }

    set contourWidth(width: number) {
        this.lineWidthIn = Math.min(Math.max(width, 1), ToolSettingsConst.MAX_WIDTH);
    }

    get contourWidth(): number {
        return this.lineWidthIn;
    }

    set numEdges(numEdges: number) {
        if (numEdges >= ToolSettingsConst.MIN_NUM_EDGES && numEdges <= ToolSettingsConst.MAX_NUM_EDGES) {
            this.numEdgesIn = numEdges;
        }
    }

    get numEdges(): number {
        return this.numEdgesIn;
    }

    stopDrawing(): void {
        this.mouseDown = false;
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
            this.updatePolygone();
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

    private updatePolygone(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawPolygone(ctx);
    }

    private drawPolygone(ctx: CanvasRenderingContext2D): void {
        const radiusX: number = Math.abs(this.mouseUpCoord.x - this.mouseDownCoord.x) / 2;
        const radiusY: number = Math.abs(this.mouseUpCoord.y - this.mouseDownCoord.y) / 2;
        const radius: number = Math.min(radiusX, radiusY);
        let centerX: number;
        let centerY: number;

        if (this.mouseUpCoord.y > this.mouseDownCoord.y && this.mouseUpCoord.x < this.mouseDownCoord.x) {
            // Bas-gauche
            centerX = this.mouseDownCoord.x - radius;
            centerY = this.mouseDownCoord.y + radius;
        } else if (this.mouseUpCoord.y > this.mouseDownCoord.y && this.mouseUpCoord.x > this.mouseDownCoord.x) {
            // Bas-droit
            centerX = this.mouseDownCoord.x + radius;
            centerY = this.mouseDownCoord.y + radius;
        } else if (this.mouseUpCoord.y < this.mouseDownCoord.y && this.mouseUpCoord.x > this.mouseDownCoord.x) {
            // Haut-droit
            centerX = this.mouseDownCoord.x + radius;
            centerY = this.mouseDownCoord.y - radius;
        } else {
            // Haut-gauche
            centerX = this.mouseDownCoord.x - radius;
            centerY = this.mouseDownCoord.y - radius;
        }

        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;
        const center: Vec2 = {
            x: centerX,
            y: centerY,
        };

        if (ctx === this.drawingService.previewCtx) {
            this.drawCirclePerimeter(ctx, center, radius);
        }

        this.drawPolygoneSides(ctx, center, radius);
        ctx.closePath();
    }

    private drawPolygoneSides(ctx: CanvasRenderingContext2D, center: Vec2, radiusAbs: number): void {
        const centerX: number = center.x;
        const centerY: number = center.y;

        // tslint:disable-next-line:no-magic-numbers
        const startingAngle = -Math.PI / 2 + (this.numEdgesIn % 2 !== 0 ? 0 : Math.PI / this.numEdgesIn);
        ctx.lineWidth = this.polygoneMode === PolygoneMode.Filled ? 0 : this.lineWidthIn;
        const lineWidthWeightedRadius = radiusAbs - ctx.lineWidth / 2;

        ctx.beginPath();
        for (let i = 0; i < this.numEdges; i++) {
            const currentX = centerX + lineWidthWeightedRadius * Math.cos(startingAngle + (i * (2 * Math.PI)) / this.numEdgesIn);
            const currentY = centerY + lineWidthWeightedRadius * Math.sin(startingAngle + (i * (2 * Math.PI)) / this.numEdgesIn);
            ctx.lineTo(currentX, currentY);
        }
        ctx.closePath();

        ctx.strokeStyle = this.colorService.secondaryRgba;
        ctx.fillStyle = this.colorService.primaryRgba;
        if (this.polygoneMode !== PolygoneMode.Contour) {
            ctx.fill();
        }
        if (this.polygoneMode !== PolygoneMode.Filled) {
            ctx.stroke();
        }
    }

    private drawCirclePerimeter(ctx: CanvasRenderingContext2D, center: Vec2, radiusAbs: number): void {
        const dashWidth = 1;
        const lineDash = 6;
        const centerX: number = center.x;
        const centerY: number = center.y;
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
