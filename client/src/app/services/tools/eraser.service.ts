import { Injectable } from '@angular/core';
import { EraserDraw } from '@app/classes/commands/eraser-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { EraserToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends PencilService {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(EraserToolConstants.SHORTCUT_KEY);
        this.toolID = EraserToolConstants.TOOL_ID;
        super.lineWidth = ToolSettingsConst.DEFAULT_ERASER_WIDTH;
    }

    onMouseMove(event: MouseEvent): void {
        if (this.isInCanvas(event) && !this.colorService.isMenuOpen) {
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawBackgroundPoint(this.getPositionFromMouse(event));
            if (this.leftMouseDown) {
                const mousePosition = this.getPositionFromMouse(event);
                this.config.pathData[this.config.pathData.length - 1].push(mousePosition);

                this.drawPreview();
                this.drawBackgroundPoint(this.getPositionFromMouse(event));
            }
        }
    }

    draw(): void {
        const command = new EraserDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    drawPreview(): void {
        const command = new EraserDraw(this.colorService, this.config);
        this.drawingService.drawPreview(command);
    }

    protected drawBackgroundPoint(point: Vec2): void {
        const ctx = this.drawingService.previewCtx;
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.fillRect(point.x - this.config.lineWidth / 2, point.y - this.config.lineWidth / 2, this.config.lineWidth, this.config.lineWidth);
        ctx.rect(point.x - this.config.lineWidth / 2, point.y - this.config.lineWidth / 2, this.config.lineWidth, this.config.lineWidth);
        ctx.stroke();
    }
}
