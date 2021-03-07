import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { PencilToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';

export enum LeftMouse {
    Released = 0,
    Pressed = 1,
}

@Injectable({
    providedIn: 'root',
})
export class PencilService extends Tool {
    protected pathData: Vec2[][];
    protected lineWidthIn: number;
    toolID: string = PencilToolConstants.TOOL_ID;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.clearPath();

        this.shortcutKey = new ShortcutKey(PencilToolConstants.SHORTCUT_KEY);
        this.lineWidthIn = ToolSettingsConst.DEFAULT_PENCIL_WIDTH;
    }

    private static isAPoint(path: Vec2[]): boolean {
        const isPoint = path.length === 1;
        return isPoint || (path.length === 2 && path[0].x === path[1].x && path[0].y === path[1].y);
    }

    get lineWidth(): number {
        return this.lineWidthIn;
    }

    set lineWidth(width: number) {
        this.lineWidthIn = Math.min(Math.max(width, 1), ToolSettingsConst.MAX_WIDTH);
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
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseMove(event: MouseEvent): void {
        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData[this.pathData.length - 1].push(mousePosition);

            // Drawing on preview canvas and then clear it with every mouse move
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
        } else {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.drawBackgroundPoint(this.getPositionFromMouse(event));
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

    protected drawBackgroundPoint(point: Vec2): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawLine(ctx, [[point]]);
    }

    protected drawLine(ctx: CanvasRenderingContext2D, pathData: Vec2[][]): void {
        ctx.beginPath();
        ctx.strokeStyle = this.colorService.primaryRgba;
        ctx.fillStyle = this.colorService.primaryRgba;
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;

        for (const paths of pathData) {
            // Special case to draw just one dot (or else it's not drawn)
            if (PencilService.isAPoint(paths)) {
                ctx.arc(paths[0].x, paths[0].y, this.lineWidthIn / 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
            } else {
                for (const point of paths) {
                    ctx.lineTo(point.x, point.y);
                }
                ctx.stroke();
                ctx.beginPath();
            }
        }
        ctx.stroke();
    }

    protected clearPath(): void {
        this.pathData = [];
        this.pathData.push([]);
    }
}
