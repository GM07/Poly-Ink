import { Injectable } from '@angular/core';
import { EllipseDraw } from '@app/classes/commands/ellipse-draw';
import { ShiftKey } from '@app/classes/shortcut/shift-key';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { EllipseConfig, EllipseMode } from '@app/classes/tool-config/ellipse-config';
import { EllipseToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { MouseButton } from '@app/constants/control';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends Tool {
    private readonly SHIFT: ShiftKey;
    toolID: string = EllipseToolConstants.TOOL_ID;
    config: EllipseConfig = new EllipseConfig();

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(EllipseToolConstants.SHORTCUT_KEY);
        this.SHIFT = new ShiftKey();
        this.config.lineWidth = 1;
        this.config.ellipseMode = EllipseMode.FilledWithContour;
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
        this.SHIFT.isDown = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    onMouseDown(event: MouseEvent): void {
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.leftMouseDown) {
            this.config.startCoords = this.getPositionFromMouse(event);
            this.config.endCoords = this.config.startCoords;
            this.config.showPerimeter = false;
            this.drawPreview();
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.leftMouseDown) {
            if (this.isInCanvas(event)) {
                this.config.endCoords = this.getPositionFromMouse(event);
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.config.showPerimeter = false;
            this.draw();
        }
        this.leftMouseDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.config.endCoords = this.getPositionFromMouse(event);
            this.config.showPerimeter = true;
            this.drawPreview();
        }
    }

    onMouseLeave(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.config.endCoords = this.getPositionFromMouse(event);
            this.updateEllipse();
        }
    }

    onMouseEnter(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.config.endCoords = this.getPositionFromMouse(event);
            this.updateEllipse();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.SHIFT.equals(event)) {
            this.config.shiftDown = true;
            if (this.leftMouseDown) {
                this.updateEllipse();
            }
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.SHIFT.equals(event)) {
            this.config.shiftDown = false;
            if (this.leftMouseDown) {
                this.updateEllipse();
            }
        }
    }

    private updateEllipse(): void {
        this.config.showPerimeter = true;
        this.drawPreview();
    }

    draw(): void {
        const command = new EllipseDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    drawPreview(): void {
        const command = new EllipseDraw(this.colorService, this.config);
        this.drawingService.drawPreview(command);
    }
}
