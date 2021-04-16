import { Injectable } from '@angular/core';
import { ShiftKey } from '@app/classes/shortcut/shift-key';
import { Tool } from '@app/classes/tool';
import { ShapeConfig } from '@app/classes/tool-config/shape-config';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export abstract class AbstractShape extends Tool {
    protected readonly SHIFT: ShiftKey;
    toolID: string;
    config: ShapeConfig;

    protected abstract draw(): void;
    protected abstract drawPreview(): void;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.SHIFT = new ShiftKey();
        this.config = new ShapeConfig();
    }

    set contourWidth(width: number) {
        this.config.lineWidth = Math.min(Math.max(width, 1), ToolSettingsConst.MAX_WIDTH);
    }

    get contourWidth(): number {
        return this.config.lineWidth;
    }

    stopDrawing(): void {
        this.leftMouseDown = false;
        this.config.shiftDown = false;
        this.drawingService.unblockUndoRedo();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseDown(event: MouseEvent): void {
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.leftMouseDown) {
            this.config.startCoords = this.getPositionFromMouse(event);
            this.config.endCoords = this.config.startCoords;
            this.drawPreview();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.leftMouseDown) {
            if (this.isInCanvas(event)) {
                this.config.endCoords = this.getPositionFromMouse(event);
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.draw();
        }
        this.leftMouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.config.endCoords = this.getPositionFromMouse(event);
            this.drawPreview();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.config.endCoords = this.getPositionFromMouse(event);
            this.drawPreview();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.config.endCoords = this.getPositionFromMouse(event);
            this.drawPreview();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.SHIFT.equals(event)) {
            this.config.shiftDown = true;
            if (this.leftMouseDown) {
                this.drawPreview();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.SHIFT.equals(event)) {
            this.config.shiftDown = false;
            if (this.leftMouseDown) {
                this.drawPreview();
            }
        }
    }
}
