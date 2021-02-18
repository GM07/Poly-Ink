import { Injectable } from '@angular/core';
import { EraserToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { ToolSettingsConst } from '@app/constants/tool-settings';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends PencilService {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.clearPath();
        this.shortcutKey = EraserToolConstants.SHORTCUT_KEY;
        this.toolID = EraserToolConstants.TOOL_ID;
        super.lineWidthIn = ToolSettingsConst.DEFAULT_ERASER_WIDTH;
    }

    onMouseMove(event: MouseEvent): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawBackgroundPoint(this.getPositionFromMouse(event));

        if (this.mouseDown) {
            const mousePosition = this.getPositionFromMouse(event);
            this.pathData[this.pathData.length - 1].push(mousePosition);

            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawLine(this.drawingService.previewCtx, this.pathData);
            this.drawBackgroundPoint(this.getPositionFromMouse(event));
        }
    }

    protected drawBackgroundPoint(point: Vec2): void {
        const ctx = this.drawingService.previewCtx;
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.fillRect(point.x - this.lineWidthIn / 2, point.y - this.lineWidthIn / 2, this.lineWidthIn, this.lineWidthIn);
        ctx.rect(point.x - this.lineWidthIn / 2, point.y - this.lineWidthIn / 2, this.lineWidthIn, this.lineWidthIn);
        ctx.stroke();
    }

    protected drawLine(ctx: CanvasRenderingContext2D, pathData: Vec2[][]): void {
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.lineWidth = this.lineWidth;
        ctx.lineCap = 'butt' as CanvasLineCap;
        ctx.lineJoin = 'bevel' as CanvasLineJoin;
        for (const paths of pathData) {
            if (paths.length >= 1)
                ctx.fillRect(paths[0].x - this.lineWidthIn / 2, paths[0].y - this.lineWidthIn / 2, this.lineWidthIn, this.lineWidthIn);
            for (const point of paths) {
                ctx.lineTo(point.x, point.y);
            }
            ctx.stroke();
            ctx.beginPath();
        }
        ctx.stroke();
    }
}
