import { Injectable } from '@angular/core';
import { ShortcutKey } from '@app/classes/shortcut-key';
import { EllipseSelectionToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionService extends AbstractSelectionService {
    private centerX: number;
    private centerY: number;
    private radiusXAbs: number;
    private radiusYAbs: number;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(EllipseSelectionToolConstants.SHORTCUT_KEY);
        this.toolID = EllipseSelectionToolConstants.TOOL_ID;
    }

    protected drawPreviewSelectionRequired(ctx: CanvasRenderingContext2D): void {
        let radiusX: number = this.width / 2;
        let radiusY: number = this.height / 2;
        this.centerX = this.mouseDownCoord.x + radiusX;
        this.centerY = this.mouseDownCoord.y + radiusY;

        if (this.shiftPressed) {
            const minRadius = Math.min(Math.abs(radiusX), Math.abs(radiusY));
            this.centerX = this.mouseDownCoord.x + Math.sign(radiusX) * minRadius;
            this.centerY = this.mouseDownCoord.y + Math.sign(radiusY) * minRadius;
            radiusX = minRadius;
            radiusY = minRadius;
        }

        this.radiusXAbs = Math.abs(radiusX);
        this.radiusYAbs = Math.abs(radiusY);
        this.width = 2 * this.radiusXAbs * Math.sign(this.width);
        this.height = 2 * this.radiusYAbs * Math.sign(this.height);

        this.drawSelection(ctx, { x: this.centerX, y: this.centerY } as Vec2);
    }

    protected drawSelection(ctx: CanvasRenderingContext2D, position: Vec2): void {
        ctx.beginPath();

        ctx.lineWidth = this.BORDER_WIDTH;
        ctx.setLineDash([this.LINE_DASH, this.LINE_DASH]);
        ctx.lineCap = 'round' as CanvasLineCap;
        ctx.lineJoin = 'round' as CanvasLineJoin;

        ctx.strokeStyle = 'black';
        ctx.ellipse(position.x, position.y, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.closePath();
        ctx.beginPath();

        ctx.lineDashOffset = this.LINE_DASH;
        ctx.strokeStyle = 'white';
        ctx.ellipse(position.x, position.y, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.lineDashOffset = 0;
        ctx.setLineDash([]);

        ctx.closePath();

        if (this.selectionCtx !== null) this.drawRectanglePerimeter(ctx, position);
    }

    private drawRectanglePerimeter(ctx: CanvasRenderingContext2D, center: Vec2): void {
        ctx.lineWidth = this.BORDER_WIDTH;
        const x = center.x - this.width / 2;
        const y = center.y - this.height / 2;

        ctx.strokeStyle = 'blue';
        ctx.beginPath();
        ctx.strokeRect(x, y, this.width, this.height);
        ctx.stroke();
        ctx.closePath();
    }

    // Todo changer pour un vec2 ?
    protected fillBackground(ctx: CanvasRenderingContext2D, currentPosX: number, currentPosY: number): void {
        if (this.firstSelectionCoords.x !== currentPosX || this.firstSelectionCoords.y !== currentPosY) {
            ctx.beginPath();
            ctx.fillStyle = 'rgb(255,20,147)';
            ctx.ellipse(this.centerX, this.centerY, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }

    protected updateSelectionRequired(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);
        const centerX = this.selectionCoords.x + Math.abs(this.width / 2);
        const centerY = this.selectionCoords.y + Math.abs(this.height / 2);

        this.fillBackground(ctx, this.selectionCoords.x, this.selectionCoords.y);

        ctx.beginPath();
        ctx.save();
        ctx.ellipse(centerX, centerY, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(this.SELECTION_DATA, this.selectionCoords.x, this.selectionCoords.y);
        ctx.restore();
        this.drawSelection(ctx, { x: centerX, y: centerY } as Vec2);
    }

    protected endSelection(): void {
        if (this.selectionCtx === null) return;
        const baseCtx = this.drawingService.baseCtx;
        const centerX = this.selectionCoords.x + Math.abs(this.width / 2);
        const centerY = this.selectionCoords.y + Math.abs(this.height / 2);

        this.fillBackground(baseCtx, this.selectionCoords.x, this.selectionCoords.y);

        baseCtx.beginPath();
        baseCtx.save();
        baseCtx.ellipse(centerX, centerY, this.radiusXAbs, this.radiusYAbs, 0, 0, 2 * Math.PI);
        baseCtx.clip();
        baseCtx.drawImage(this.SELECTION_DATA, this.selectionCoords.x, this.selectionCoords.y);
        baseCtx.restore();
        baseCtx.closePath();
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.selectionCtx = null;
        this.selectionCoords = { x: 0, y: 0 } as Vec2;
    }
}
