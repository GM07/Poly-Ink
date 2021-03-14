import { Injectable } from '@angular/core';
import { RectangleDraw } from '@app/classes/commands/rectangle-draw';
import { ShiftKey } from '@app/classes/shortcut/shift-key';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { RectangleConfig, RectangleMode } from '@app/classes/tool-config/rectangle-config';
import { RectangleToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
@Injectable({
    providedIn: 'root',
})
export class RectangleService extends Tool {
    private readonly SHIFT: ShiftKey;
    toolID: string = RectangleToolConstants.TOOL_ID;
    config: RectangleConfig = new RectangleConfig();

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(RectangleToolConstants.SHORTCUT_KEY);
        this.SHIFT = new ShiftKey();
        this.config.lineWidth = 1;
        this.config.rectangleMode = RectangleMode.FilledWithContour;
    }

    set contourWidth(width: number) {
        const max = 50;
        this.config.lineWidth = Math.min(Math.max(width, 1), max);
    }

    get contourWidth(): number {
        return this.config.lineWidth;
    }

    stopDrawing(): void {
        this.leftMouseDown = false;
        this.config.shiftDown = false;
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
            const ctx = this.drawingService.previewCtx;
            this.drawingService.clearCanvas(ctx);
            this.drawPreview();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.config.endCoords = this.getPositionFromMouse(event);
            this.updateRectangle();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.config.endCoords = this.getPositionFromMouse(event);
            this.updateRectangle();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.SHIFT.equals(event)) {
            this.config.shiftDown = true;
            if (this.leftMouseDown) {
                this.updateRectangle();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.SHIFT.equals(event)) {
            this.config.shiftDown = false;
            if (this.leftMouseDown) {
                this.updateRectangle();
            }
        }
    }

    private updateRectangle(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        this.drawPreview();
    }

    draw(): void {
        const command = new RectangleDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    drawPreview(): void {
        const command = new RectangleDraw(this.colorService, this.config);
        this.drawingService.drawPreview(command);
    }
}
