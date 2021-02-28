import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut-key';
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
        const baseCtx = this.drawingService.baseCtx;

        this.fillBackground(baseCtx, this.selectionCoords.x, this.selectionCoords.y);

        baseCtx.drawImage(this.SELECTION_DATA, this.selectionCoords.x, this.selectionCoords.y);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectionCtx = null;

        this.selectionCoords = { x: 0, y: 0 } as Vec2;
        this.translationOrigin = { x: 0, y: 0 } as Vec2;
    }

    protected fillBackground(ctx: CanvasRenderingContext2D, currentPosX: number, currentPosY: number): void {
        if (this.firstSelectionCoords.x !== currentPosX || this.firstSelectionCoords.y !== currentPosY) {
            ctx.beginPath();
            ctx.fillStyle = 'rgb(255,20,147)';
            ctx.fillRect(this.firstSelectionCoords.x, this.firstSelectionCoords.y, Math.abs(this.width), Math.abs(this.height));
            ctx.closePath();
        }
    }

    protected updateSelectionRequired(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);

        this.fillBackground(ctx, this.selectionCoords.x, this.selectionCoords.y);

        const rectangleCoords = { x: this.selectionCoords.x, y: this.selectionCoords.y } as Vec2;
        ctx.drawImage(this.SELECTION_DATA, this.selectionCoords.x, this.selectionCoords.y);
        this.drawSelection(ctx, rectangleCoords, Math.abs(this.width), Math.abs(this.height));
    }

    protected drawPreviewSelectionRequired(ctx: CanvasRenderingContext2D): void {
        if (this.shiftPressed) {
            this.height = Math.sign(this.height) * Math.min(Math.abs(this.width), Math.abs(this.height));
            this.width = Math.sign(this.width) * Math.abs(this.height);
        }

        this.drawSelection(ctx, this.mouseDownCoord, this.width, this.height);
    }

    protected drawSelection(ctx: CanvasRenderingContext2D, position: Vec2, width: number, height: number): void {
        ctx.lineWidth = this.BORDER_WIDTH;
        ctx.setLineDash([this.LINE_DASH, this.LINE_DASH]);
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'miter' as CanvasLineJoin;
        ctx.lineCap = 'square' as CanvasLineCap;

        ctx.strokeRect(position.x, position.y, width, height);
        ctx.lineDashOffset = this.LINE_DASH;
        ctx.strokeStyle = 'white';
        ctx.strokeRect(position.x, position.y, width, height);

        ctx.lineDashOffset = 0;
        ctx.setLineDash([]);
    }

}
