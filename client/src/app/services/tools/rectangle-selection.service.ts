import { Injectable } from '@angular/core';
import { RectangleSelectionDraw } from '@app/classes/commands/rectangle-selection-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { RectangleSelectionToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends AbstractSelectionService {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(RectangleSelectionToolConstants.SHORTCUT_KEY);
        this.toolID = RectangleSelectionToolConstants.TOOL_ID;
    }

    protected endSelection(): void {
        if (this.selectionCtx === null) return;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.draw();

        this.selectionCtx = null;

        this.config.endCoords = { x: 0, y: 0 } as Vec2;
        this.translationOrigin = { x: 0, y: 0 } as Vec2;
    }

    protected fillBackground(ctx: CanvasRenderingContext2D, currentPos: Vec2): void {
        if (this.config.startCoords.x !== currentPos.x || this.config.startCoords.y !== currentPos.y) {
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.fillRect(this.config.startCoords.x, this.config.startCoords.y, Math.abs(this.config.width), Math.abs(this.config.height));
            ctx.closePath();
        }
    }

    protected updateSelectionRequired(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);

        this.fillBackground(ctx, this.config.endCoords);

        const rectangleCoords = { x: this.config.endCoords.x, y: this.config.endCoords.y } as Vec2;
        ctx.drawImage(this.SELECTION_DATA, this.config.endCoords.x, this.config.endCoords.y);
        this.drawSelection(ctx, rectangleCoords, { x: Math.abs(this.config.width), y: Math.abs(this.config.height) } as Vec2);
    }

    protected drawPreviewSelectionRequired(): void {
        const ctx = this.drawingService.previewCtx;
        if (this.config.shiftDown) {
            this.config.height = Math.sign(this.config.height) * Math.min(Math.abs(this.config.width), Math.abs(this.config.height));
            this.config.width = Math.sign(this.config.width) * Math.abs(this.config.height);
        }

        this.drawSelection(ctx, this.mouseDownCoord, { x: this.config.width, y: this.config.height } as Vec2);
    }

    protected drawSelection(ctx: CanvasRenderingContext2D, position: Vec2, size: Vec2): void {
        ctx.lineWidth = this.BORDER_WIDTH;
        ctx.setLineDash([this.LINE_DASH, this.LINE_DASH]);
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'miter' as CanvasLineJoin;
        ctx.lineCap = 'square' as CanvasLineCap;

        ctx.strokeRect(position.x, position.y, size.x, size.y);
        ctx.lineDashOffset = this.LINE_DASH;
        ctx.strokeStyle = 'white';
        ctx.strokeRect(position.x, position.y, size.x, size.y);

        ctx.lineDashOffset = 0;
        ctx.setLineDash([]);
    }

    draw(): void {
        const command = new RectangleSelectionDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }
}
