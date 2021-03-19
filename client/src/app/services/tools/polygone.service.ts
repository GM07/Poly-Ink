import { Injectable } from '@angular/core';
import { PolygonDraw } from '@app/classes/commands/polygon-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { PolygonConfig } from '@app/classes/tool-config/polygon-config';
import { PolygoneToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export class PolygoneService extends Tool {
    toolID: string;
    config: PolygonConfig = new PolygonConfig();

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(PolygoneToolConstants.SHORTCUT_KEY);
        this.toolID = PolygoneToolConstants.TOOL_ID;
    }

    set contourWidth(width: number) {
        this.config.lineWidth = Math.min(Math.max(width, 1), ToolSettingsConst.MAX_WIDTH);
    }

    get contourWidth(): number {
        return this.config.lineWidth;
    }

    set numEdges(numEdges: number) {
        if (numEdges >= ToolSettingsConst.MIN_NUM_EDGES && numEdges <= ToolSettingsConst.MAX_NUM_EDGES) {
            this.config.numEdges = numEdges;
        }
    }

    get numEdges(): number {
        return this.config.numEdges;
    }

    stopDrawing(): void {
        this.leftMouseDown = false;
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

    draw(): void {
        this.config.showPerimeter = false;
        const command = new PolygonDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    drawPreview(): void {
        this.config.showPerimeter = true;
        const command = new PolygonDraw(this.colorService, this.config);
        this.drawingService.drawPreview(command);
    }
}
