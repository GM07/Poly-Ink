import { Injectable } from '@angular/core';
import { LineDrawer } from '@app/classes/line-drawer';
import { Geometry } from '@app/classes/math/geometry';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { LassoToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { LassoDraw } from '../../classes/commands/lasso-draw';
import { LassoConfig } from '../../classes/tool-config/lasso-config';

@Injectable({
    providedIn: 'root',
})
export class LassoService extends AbstractSelectionService {
    lineDrawer: LineDrawer;
    configLasso: LassoConfig;
    private start: Vec2;
    private end: Vec2;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(LassoToolConstants.SHORTCUT_KEY);
        this.toolID = LassoToolConstants.TOOL_ID;
        this.initService();
    }

    initService(): void {
        this.configLasso = new LassoConfig();
        this.config = this.configLasso;
        this.lineDrawer = new LineDrawer(this.configLasso, this.drawingService);
        this.lineDrawer.drawPreview.subscribe(() => {
            this.drawPreview();
        });
        this.initSelection();
    }

    onClosedPath(): void {
        this.endSelection();
        this.selectionResize.stopDrawing();
        this.selectionTranslation.stopDrawing();
        this.mouseDownCoord = this.start;
        this.mouseUpCoord = this.end;
        const size: Vec2 = this.end.substract(this.start);
        this.configLasso.width = size.x;
        this.configLasso.height = size.y;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.startSelection();
    }

    onMouseDown(event: MouseEvent): void {
        this.lineDrawer.leftMouseDown = event.button === MouseButton.Left;
        this.leftMouseDown = this.lineDrawer.leftMouseDown;

        if (!this.lineDrawer.leftMouseDown) return;

        if (this.configLasso.selectionCtx === null) {
            this.lineDrawer.pointToAdd = this.getPositionFromMouse(event);

            if (this.configLasso.points.length > 2) {
                const closedLoop: boolean =
                    Geometry.getDistanceBetween(this.lineDrawer.pointToAdd, this.configLasso.points[0]) <=
                    ToolSettingsConst.MINIMUM_DISTANCE_TO_CLOSE_PATH;

                if (closedLoop) {
                    this.configLasso.points.push(this.configLasso.points[0]);
                    [this.start, this.end] = this.findSmallestRectangle();
                    this.onClosedPath();
                } else {
                    this.lineDrawer.addNewPoint(event);
                }
            } else {
                this.lineDrawer.addNewPoint(event);
            }
        } else {
            super.onMouseDown(event);
            this.stopDrawing();
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.configLasso.points.length === 0 || event.clientX === undefined || event.clientY === undefined) {
            return;
        }

        if (this.configLasso.selectionCtx === null) {
            this.lineDrawer.followCursor(event);
        } else {
            super.onMouseMove(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.leftMouseDown && this.configLasso.selectionCtx !== null) {
            this.setMouseUpCoord(event);
            this.selectionTranslation.onMouseUp(this.mouseUpCoord);
        } else {
            super.onMouseUp(event);
        }

        this.leftMouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.configLasso.selectionCtx !== null) {
            super.onKeyDown(event);
            return;
        }

        const shortcut = ShortcutKey.get(this.lineDrawer.shortcutList, event, true);
        if (shortcut !== undefined && shortcut.isDown !== true) {
            shortcut.isDown = true;
            this.lineDrawer.handleKeys(shortcut);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        this.lineDrawer.shift.isDown = event.shiftKey;

        const shortcut = ShortcutKey.get(this.lineDrawer.shortcutList, event, true);
        if (shortcut !== undefined) {
            shortcut.isDown = false;
            this.lineDrawer.handleKeys(shortcut);
        }
    }

    private findSmallestRectangle(): [Vec2, Vec2] {
        const start: Vec2 = new Vec2(this.drawingService.canvas.width + 1, this.drawingService.canvas.height + 1);
        const end: Vec2 = new Vec2(-1, -1);
        this.configLasso.points.forEach((point) => {
            start.x = point.x < start.x ? point.x : start.x;
            start.y = point.y < start.y ? point.y : start.y;
            end.x = point.x > end.x ? point.x : end.x;
            end.y = point.y > end.y ? point.y : end.y;
        });

        return [start, end];
    }

    draw(): void {
        const command = new LassoDraw(this.colorService, this.configLasso);
        this.drawingService.draw(command);
    }

    drawPreview(): void {
        const command = new LassoDraw(this.colorService, this.configLasso);
        this.drawingService.drawPreview(command);
    }

    drawPreviewSelectionRequired(): void {
        if (this.configLasso.points.length === 0) return;

        const size: Vec2 = this.end.substract(this.start);
        this.drawSelection(this.drawingService.previewCtx, this.start, size);
    }

    protected endSelection(): void {
        if (this.configLasso.selectionCtx === null) return;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.draw();

        this.configLasso.selectionCtx = null;
        this.configLasso.endCoords = new Vec2(0, 0);
    }

    protected fillBackground(ctx: CanvasRenderingContext2D, currentPos: Vec2): void {
        if (!this.configLasso.didChange()) return;

        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(this.configLasso.points[0].x, this.configLasso.points[0].y);
        for (let index = 1; index < this.configLasso.points.length; index++) {
            const point = this.configLasso.points[index];
            ctx.lineTo(point.x, point.y);
        }
        ctx.fill();
        ctx.closePath();
    }

    protected updateSelectionRequired(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);

        this.fillBackground(ctx, this.configLasso.endCoords);

        ctx.beginPath();
        ctx.save();

        const dp = this.configLasso.endCoords.substract(this.configLasso.startCoords);
        ctx.beginPath();
        ctx.moveTo(this.configLasso.points[0].x + dp.x, this.configLasso.points[0].y + dp.y);
        for (let index = 1; index < this.configLasso.points.length; index++) {
            const point = this.configLasso.points[index];
            ctx.lineTo(point.x + dp.x, point.y + dp.y);
        }
        ctx.clip();

        ctx.drawImage(this.selectionData, this.configLasso.endCoords.x, this.configLasso.endCoords.y);
        ctx.restore();

        this.drawSelection(ctx, this.configLasso.endCoords, new Vec2(Math.abs(this.configLasso.width), Math.abs(this.configLasso.height)));
    }

    protected drawSelection(ctx: CanvasRenderingContext2D, position: Vec2, size: Vec2): void {
        ctx.beginPath();

        ctx.lineWidth = this.BORDER_WIDTH;
        ctx.setLineDash([this.LINE_DASH, this.LINE_DASH]);
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'miter' as CanvasLineJoin;
        ctx.lineCap = 'square' as CanvasLineCap;

        const firstPoint: Vec2 = this.configLasso.points[0].substract(this.start).add(position);
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (let index = 1; index < this.configLasso.points.length; index++) {
            const point = this.configLasso.points[index].substract(this.start).add(position);
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        ctx.closePath();

        ctx.lineDashOffset = 0;
        ctx.setLineDash([]);
    }

    stopDrawing() {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.initService();
        super.stopDrawing();
    }
}
