import { Injectable } from '@angular/core';
import { ShiftKey } from '@app/classes/shortcut/shift-key';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';

export enum ShapeMode {
    Contour = 0,
    Filled = 1,
    FilledWithContour = 2,
}

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractShape extends Tool {
    protected readonly SHIFT: ShiftKey;
    toolID: string;
    protected mouseUpCoord: Vec2;
    protected lineWidthIn: number;
    shapeMode: ShapeMode;

    protected abstract drawShape(ctx: CanvasRenderingContext2D): void;

    protected abstract updateShape(): void;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.SHIFT = new ShiftKey();
        this.lineWidthIn = 1;
        this.shapeMode = ShapeMode.FilledWithContour;
    }

    set contourWidth(width: number) {
        this.lineWidthIn = Math.min(Math.max(width, 1), ToolSettingsConst.MAX_WIDTH);
    }

    get contourWidth(): number {
        return this.lineWidthIn;
    }

    stopDrawing(): void {
        this.leftMouseDown = false;
        this.SHIFT.isDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseDown(event: MouseEvent): void {
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.leftMouseDown) {
            this.mouseDownCoord = this.getPositionFromMouse(event);
            this.mouseUpCoord = this.mouseDownCoord;
            this.drawShape(this.drawingService.previewCtx);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.leftMouseDown) {
            if (this.isInCanvas(event)) {
                this.mouseUpCoord = this.getPositionFromMouse(event);
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawShape(this.drawingService.baseCtx);
        }
        this.leftMouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.mouseUpCoord = this.getPositionFromMouse(event);
            const ctx = this.drawingService.previewCtx;
            this.drawingService.clearCanvas(ctx);
            this.drawShape(ctx);
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.updateShape();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.updateShape();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.SHIFT.equals(event)) {
            this.SHIFT.isDown = true;
            if (this.leftMouseDown) {
                this.updateShape();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.SHIFT.equals(event)) {
            this.SHIFT.isDown = false;
            if (this.leftMouseDown) {
                this.updateShape();
            }
        }
    }
}
