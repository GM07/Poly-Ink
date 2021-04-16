import { Injectable } from '@angular/core';
import { RectangleSelectionDraw } from '@app/classes/commands/rectangle-selection-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { RectangleSelectionToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleSelectionService extends AbstractSelectionService {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(RectangleSelectionToolConstants.SHORTCUT_KEY);
        this.toolID = RectangleSelectionToolConstants.TOOL_ID;
    }

    draw(): void {
        const command = new RectangleSelectionDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    protected endSelection(): void {
        if (this.config.previewSelectionCtx === null) return;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.draw();

        this.config.previewSelectionCtx = null;
        this.config.endCoords = new Vec2(0, 0);
        this.config.markedForDelete = false;
        this.config.markedForPaste = false;
    }

    protected fillBackground(ctx: CanvasRenderingContext2D): void {
        if (!this.config.didChange()) return;
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.fillRect(this.config.startCoords.x, this.config.startCoords.y, Math.abs(this.config.originalWidth), Math.abs(this.config.originalHeight));
        ctx.closePath();
    }

    protected drawPreviewSelection(): void {
        super.drawPreviewSelection();

        const ctx = this.drawingService.previewCtx;
        if (this.config.shift.isDown) {
            this.config.height = Math.sign(this.config.height) * Math.min(Math.abs(this.config.width), Math.abs(this.config.height));
            this.config.width = Math.sign(this.config.width) * Math.abs(this.config.height);
        }

        this.drawSelection(ctx, this.mouseDownCoord, new Vec2(this.config.width, this.config.height));
    }

    protected drawSelection(ctx: CanvasRenderingContext2D, position: Vec2, size: Vec2): void {
        ctx.lineWidth = AbstractSelectionService.BORDER_WIDTH;
        ctx.setLineDash([AbstractSelectionService.LINE_DASH, AbstractSelectionService.LINE_DASH]);
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'miter' as CanvasLineJoin;
        ctx.lineCap = 'square' as CanvasLineCap;

        ctx.strokeRect(position.x, position.y, size.x, size.y);
        ctx.lineDashOffset = AbstractSelectionService.LINE_DASH;
        ctx.strokeStyle = 'white';
        ctx.strokeRect(position.x, position.y, size.x, size.y);

        ctx.lineDashOffset = 0;
        ctx.setLineDash([]);
    }

    protected updateSelectionRequired(): void {
        const ctx = this.drawingService.previewCtx;
        const size = new Vec2(this.config.width, this.config.height).apply(Math.abs);
        RectangleSelectionDraw.drawClippedSelection(ctx, this.config);
        this.drawSelection(ctx, this.config.endCoords, size);
    }
}
