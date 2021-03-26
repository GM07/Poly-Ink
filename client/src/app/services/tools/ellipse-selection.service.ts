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
        const radius: Vec2 = new Vec2(this.config.width / 2, this.config.height / 2);
        this.center = new Vec2(this.mouseDownCoord.x + radius.x, this.mouseDownCoord.y + radius.y);
        if (this.config.shift.isDown) {
            const minRadius = Math.min(Math.abs(radius.x), Math.abs(radius.y));
            this.center.x = this.mouseDownCoord.x + Math.sign(radius.x) * minRadius;
            this.center.y = this.mouseDownCoord.y + Math.sign(radius.y) * minRadius;
            radius.x = minRadius;
            radius.y = minRadius;
        }

        this.radiusAbs = radius.apply(Math.abs);
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
        if (!this.config.startCoords.equals(currentPos)) {
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
        const center: Vec2 = this.config.endCoords.add(new Vec2(this.config.width / 2, this.config.height / 2).apply(Math.abs));

        this.fillBackground(ctx, this.config.endCoords);

        ctx.beginPath();
        ctx.save();
        ctx.ellipse(center.x, center.y, this.radiusAbs.x, this.radiusAbs.y, 0, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(this.selectionData, this.config.endCoords.x, this.config.endCoords.y);
        ctx.restore();
        this.drawSelection(ctx, center, this.radiusAbs);
    }

    protected endSelection(): void {
        if (this.config.selectionCtx === null) return;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.draw();

        this.config.selectionCtx = null;
        this.config.endCoords = { x: 0, y: 0 } as Vec2;
    }

    draw(): void {
        const command = new EllipseSelectionDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }
}
