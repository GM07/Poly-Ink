import { Injectable } from '@angular/core';
import { LassoDraw } from '@app/classes/commands/lasso-draw';
import { LineDrawer } from '@app/classes/line-drawer';
import { Geometry } from '@app/classes/math/geometry';
import { Line } from '@app/classes/math/line';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { LassoConfig } from '@app/classes/tool-config/lasso-config';
import { LassoToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export class LassoService extends AbstractSelectionService {
    lineDrawer: LineDrawer;
    configLasso: LassoConfig;
    private start: Vec2;
    private end: Vec2;
    private lines: Line[];

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(LassoToolConstants.SHORTCUT_KEY);
        this.toolID = LassoToolConstants.TOOL_ID;
        this.initService();
    }

    initService(): void {
        this.lines = [];
        this.configLasso = new LassoConfig();
        this.config = this.configLasso;
        this.lineDrawer = new LineDrawer(this.configLasso, this.drawingService);
        this.lineDrawer.drawPreview.subscribe(() => {
            this.drawPreview();
        });
        this.lineDrawer.removeLine.subscribe(() => {
            this.lines.pop();
        });
        this.initSelection();
    }

    private onClosedPath(): void {
        this.endSelection();
        this.selectionResize.stopDrawing();
        this.selectionTranslation.stopDrawing();
        this.mouseDownCoord = this.start;
        this.mouseUpCoord = this.end;
        const size: Vec2 = this.end.substract(this.start);
        this.configLasso.width = size.x;
        this.configLasso.height = size.y;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.configLasso.inSelection = true;
        this.startSelection();
    }

    private addPointToSelection(event: MouseEvent): void {
        this.lineDrawer.addNewPoint(event);
        this.addNewLine();
    }

    private addNewLine(): void {
        if (this.configLasso.points.length > 1) {
            const length: number = this.configLasso.points.length;
            this.lines.push(new Line(this.configLasso.points[length - 2], this.configLasso.points[length - 1]));
        }
    }

    private createSelection(event: MouseEvent): void {
        if (this.configLasso.points.length > 1 && this.configLasso.intersecting) return;

        if (this.configLasso.points.length > 2) {
            const closedLoop: boolean =
                Geometry.getDistanceBetween(this.lineDrawer.pointToAdd, this.configLasso.points[0]) <=
                ToolSettingsConst.MINIMUM_DISTANCE_TO_CLOSE_PATH;

            if (closedLoop) {
                this.configLasso.points.push(this.configLasso.points[0]);
                [this.start, this.end] = this.findSmallestRectangle();
                this.onClosedPath();
            } else {
                this.addPointToSelection(event);
            }
        } else {
            this.addPointToSelection(event);
        }
    }

    onMouseDown(event: MouseEvent): void {
        this.lineDrawer.leftMouseDown = event.button === MouseButton.Left;
        this.leftMouseDown = this.lineDrawer.leftMouseDown;

        if (!this.leftMouseDown) return;

        if (this.configLasso.selectionCtx === null) {
            this.createSelection(event);
        } else {
            this.endSelection();
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.configLasso.points.length === 0 || event.clientX === undefined || event.clientY === undefined) {
            return;
        }

        if (this.configLasso.selectionCtx === null) {
            const nextPoint = this.lineDrawer.pointToAdd;
            this.configLasso.intersecting = Geometry.lastLineIntersecting(
                this.lines,
                new Line(this.configLasso.points[this.configLasso.points.length - 1], nextPoint),
            );
            this.lineDrawer.followCursor(event);
        } else {
            super.onMouseMove(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (this.leftMouseDown) {
            this.setMouseUpCoord(event);
            if (this.configLasso.selectionCtx !== null) {
                this.selectionTranslation.onMouseUp(this.mouseUpCoord);
            }
        }
        this.leftMouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.configLasso.selectionCtx === null) {
            const shortcut = ShortcutKey.get(this.lineDrawer.shortcutList, event, true);
            if (shortcut !== undefined && shortcut.isDown !== true) {
                shortcut.isDown = true;
                this.lineDrawer.handleKeys(shortcut);
            }
        } else {
            super.onKeyDown(event);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.configLasso.selectionCtx === null) {
            this.lineDrawer.shift.isDown = event.shiftKey;

            const shortcut = ShortcutKey.get(this.lineDrawer.shortcutList, event, true);
            if (shortcut !== undefined) {
                shortcut.isDown = false;
                this.lineDrawer.handleKeys(shortcut);
            }
        } else {
            super.onKeyUp(event);
        }
    }

    stopDrawing(): void {
        this.endSelection();
        this.initService();
        super.stopDrawing();
    }

    private findSmallestRectangle(): [Vec2, Vec2] {
        const start: Vec2 = new Vec2(this.drawingService.canvas.width + 1, this.drawingService.canvas.height + 1);
        const end: Vec2 = new Vec2(0 - 1, 0 - 1);
        this.configLasso.points.forEach((point) => {
            start.x = point.x < start.x ? point.x : start.x;
            start.y = point.y < start.y ? point.y : start.y;
            end.x = point.x > end.x ? point.x : end.x;
            end.y = point.y > end.y ? point.y : end.y;
        });

        return [start, end];
    }

    private draw(): void {
        const command = new LassoDraw(this.colorService, this.configLasso);
        this.drawingService.draw(command);
        this.initService();
    }

    private drawPreview(): void {
        const command = new LassoDraw(this.colorService, this.configLasso);
        this.drawingService.drawPreview(command);
    }

    protected drawPreviewSelectionRequired(): void {
        if (this.configLasso.points.length === 0) return;

        const size: Vec2 = this.end.substract(this.start);
        this.drawSelection(this.drawingService.previewCtx, this.start, size);
    }

    protected endSelection(): void {
        if (this.configLasso.selectionCtx === null) return;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.draw();

        this.initService();
    }

    protected fillBackground(ctx: CanvasRenderingContext2D, _: Vec2): void {
        if (!this.configLasso.didChange()) return;

        ctx.fillStyle = 'white';
        LineDrawer.drawFilledLinePath(ctx, this.configLasso.points);
    }

    protected updateSelectionRequired(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);

        this.fillBackground(ctx, this.configLasso.endCoords);

        ctx.beginPath();
        ctx.save();

        const dp = this.configLasso.endCoords.substract(this.configLasso.startCoords);
        LineDrawer.drawClippedLinePath(ctx, this.configLasso.points, dp);

        ctx.drawImage(this.selectionData, this.configLasso.endCoords.x, this.configLasso.endCoords.y);
        ctx.restore();

        this.drawSelection(ctx, this.configLasso.endCoords, new Vec2(Math.abs(this.configLasso.width), Math.abs(this.configLasso.height)));
    }

    protected drawSelection(ctx: CanvasRenderingContext2D, position: Vec2, _: Vec2): void {
        if (this.configLasso.points.length < 2) return;
        LineDrawer.drawDashedLinePath(ctx, this.configLasso.points, position.substract(this.start));
    }
}
