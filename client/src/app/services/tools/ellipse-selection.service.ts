import { Injectable } from '@angular/core';
import { EllipseSelectionDraw } from '@app/classes/commands/ellipse-selection-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { EllipseSelectionToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionService extends AbstractSelectionService {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(EllipseSelectionToolConstants.SHORTCUT_KEY);
        this.toolID = EllipseSelectionToolConstants.TOOL_ID;
    }

    protected drawPreviewSelection(): void {
        super.drawPreviewSelection();

        const ctx = this.drawingService.previewCtx;
        let radiusX: number = this.config.width / 2;
        let radiusY: number = this.config.height / 2;
        if (this.config.shift.isDown) {
            const minRadius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
            radiusX = Math.sign(radiusX) * minRadius;
            radiusY = Math.sign(radiusY) * minRadius;
        }

        const center = new Vec2(this.mouseDownCoord.x + radiusX, this.mouseDownCoord.y + radiusY);
        const radiusAbs = new Vec2(Math.abs(radiusX), Math.abs(radiusY));
        this.config.width = 2 * radiusAbs.x * Math.sign(this.config.width);
        this.config.height = 2 * radiusAbs.y * Math.sign(this.config.height);

        this.drawSelection(ctx, center, radiusAbs);
    }

    protected drawSelection(ctx: CanvasRenderingContext2D, position: Vec2, size: Vec2): void {
        ctx.beginPath();

        ctx.lineWidth = AbstractSelectionService.BORDER_WIDTH;
        ctx.setLineDash([AbstractSelectionService.LINE_DASH, AbstractSelectionService.LINE_DASH]);
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;

        ctx.strokeStyle = 'black';
        ctx.ellipse(position.x, position.y, size.x, size.y, 0, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.closePath();
        ctx.beginPath();

        ctx.lineDashOffset = AbstractSelectionService.LINE_DASH;
        ctx.strokeStyle = 'white';
        ctx.ellipse(position.x, position.y, size.x, size.y, 0, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.lineDashOffset = 0;
        ctx.setLineDash([]);

        ctx.closePath();
    }

    protected fillBackground(ctx: CanvasRenderingContext2D): void {
        if (!this.config.didChange()) return;

        const radius = new Vec2(this.config.originalWidth / 2, this.config.originalHeight / 2).apply(Math.abs);
        const center = this.config.startCoords.add(radius);
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
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

    protected updateSelectionRequired(): void {
        const ctx = this.drawingService.previewCtx;
        const radius = new Vec2(this.config.width / 2, this.config.height / 2).apply(Math.abs);
        const center = radius.add(this.config.endCoords);

        EllipseSelectionDraw.drawClippedSelection(ctx, this.config);

        this.drawSelection(ctx, center, radius);
    }

    draw(): void {
        const command = new EllipseSelectionDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }
}
