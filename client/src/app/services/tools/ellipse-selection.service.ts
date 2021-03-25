import { Injectable } from '@angular/core';
import { EllipseSelectionDraw } from '@app/classes/commands/ellipse-selection-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { EllipseSelectionToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionService extends AbstractSelectionService {
    private center: Vec2;
    private radiusAbs: Vec2;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(EllipseSelectionToolConstants.SHORTCUT_KEY);
        this.toolID = EllipseSelectionToolConstants.TOOL_ID;
    }

    protected drawPreviewSelectionRequired(): void {
        const ctx = this.drawingService.previewCtx;
        let radiusX: number = this.config.width / 2;
        let radiusY: number = this.config.height / 2;
        this.center = new Vec2(this.mouseDownCoord.x + radiusX, this.mouseDownCoord.y + radiusY);
        if (this.config.shiftDown) {
            const minRadius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
            this.center.x = this.mouseDownCoord.x + Math.sign(radiusX) * minRadius;
            this.center.y = this.mouseDownCoord.y + Math.sign(radiusY) * minRadius;
            radiusX = minRadius;
            radiusY = minRadius;
        }

        this.radiusAbs = new Vec2(Math.abs(radiusX), Math.abs(radiusY));
        this.config.width = 2 * this.radiusAbs.x * Math.sign(this.config.width);
        this.config.height = 2 * this.radiusAbs.y * Math.sign(this.config.height);

        this.drawSelection(ctx, this.center, this.radiusAbs);
    }

    protected drawSelection(ctx: CanvasRenderingContext2D, position: Vec2, size: Vec2): void {
        ctx.beginPath();

        ctx.lineWidth = this.BORDER_WIDTH;
        ctx.setLineDash([this.LINE_DASH, this.LINE_DASH]);
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;

        ctx.strokeStyle = 'black';
        ctx.ellipse(position.x, position.y, size.x, size.y, 0, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.closePath();
        ctx.beginPath();

        ctx.lineDashOffset = this.LINE_DASH;
        ctx.strokeStyle = 'white';
        ctx.ellipse(position.x, position.y, size.x, size.y, 0, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.lineDashOffset = 0;
        ctx.setLineDash([]);

        ctx.closePath();
    }

    protected fillBackground(ctx: CanvasRenderingContext2D, currentPos: Vec2): void {
        if (this.config.startCoords.x !== currentPos.x || this.config.startCoords.y !== currentPos.y) {
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.ellipse(this.center.x, this.center.y, this.radiusAbs.x, this.radiusAbs.y, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }

    protected updateSelectionRequired(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        const centerX = this.config.endCoords.x + Math.abs(this.config.width / 2);
        const centerY = this.config.endCoords.y + Math.abs(this.config.height / 2);

        this.fillBackground(ctx, this.config.endCoords);

        ctx.beginPath();
        ctx.save();
        ctx.ellipse(centerX, centerY, this.radiusAbs.x, this.radiusAbs.y, 0, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(this.SELECTION_DATA, this.config.endCoords.x, this.config.endCoords.y);
        ctx.restore();
        this.drawSelection(ctx, { x: centerX, y: centerY } as Vec2, this.radiusAbs);
    }

    protected endSelection(): void {
        if (this.selectionCtx === null) return;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.draw();
        this.selectionCtx = null;
        this.config.endCoords = { x: 0, y: 0 } as Vec2;
    }

    draw(): void {
        const command = new EllipseSelectionDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }
}
