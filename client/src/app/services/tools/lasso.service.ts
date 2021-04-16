import { Injectable } from '@angular/core';
import { LassoDraw } from '@app/classes/commands/lasso-draw';
import { LineDrawer } from '@app/classes/line-drawer';
import { Geometry } from '@app/classes/math/geometry';
import { Line } from '@app/classes/math/line';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { SpecialKeys } from '@app/classes/shortcut/special-keys';
import { LassoConfig } from '@app/classes/tool-config/lasso-config';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { LassoToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { Colors } from 'src/color-picker/constants/colors';
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
    private selectAllShortcut: ShortcutKey;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(LassoToolConstants.SHORTCUT_KEY);
        this.toolID = LassoToolConstants.TOOL_ID;
        this.initAttribs(new LassoConfig());
        this.selectAllShortcut = new ShortcutKey('a', { ctrlKey: true } as SpecialKeys);
    }

    initAttribs(config: SelectionConfig): void {
        this.lines = [];
        this.configLasso = config as LassoConfig;
        this.lineDrawer = new LineDrawer(this.configLasso, this.drawingService);
        this.lineDrawer.drawPreview.subscribe(() => {
            this.drawPreview();
        });
        this.lineDrawer.removeLine.subscribe(() => {
            this.lines.pop();
        });
        this.lineDrawer.removeLines.subscribe(() => {
            this.lines = [];
        });
        super.initAttribs(config);
    }

    onMouseDown(event: MouseEvent): void {
        this.lineDrawer.leftMouseDown = event.button === MouseButton.Left;
        this.leftMouseDown = this.lineDrawer.leftMouseDown;

        if (!this.leftMouseDown) return;

        if (this.configLasso.previewSelectionCtx === null) {
            this.createSelection(event);
        } else {
            this.endSelection();
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.configLasso.points.length === 0 || event.clientX === undefined || event.clientY === undefined) {
            return;
        }

        if (this.configLasso.previewSelectionCtx === null) {
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
            if (this.configLasso.previewSelectionCtx !== null) {
                this.selectionTranslation.onMouseUp(this.mouseUpCoord);
            }
        }
        this.leftMouseDown = false;
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.configLasso.previewSelectionCtx === null) {
            if (this.selectAllShortcut.equals(event)) {
                super.onKeyDown(event);
                return;
            }

            const shortcut = ShortcutKey.get(this.lineDrawer.shortcutList, event, true);
            if (shortcut !== undefined && shortcut.isDown !== true) {
                shortcut.isDown = true;
                this.lineDrawer.handleKeys(shortcut);
            }
        } else if (!this.selectAllShortcut.equals(event)) {
            super.onKeyDown(event);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.configLasso.previewSelectionCtx === null) {
            const shortcut = ShortcutKey.get(this.lineDrawer.shortcutList, event, true);
            if (shortcut !== undefined) {
                shortcut.isDown = false;
                this.lineDrawer.handleKeys(shortcut);
            }
        } else {
            super.onKeyUp(event);
        }
    }

    selectAll(): void {
        const width = this.drawingService.canvas.width;
        const height = this.drawingService.canvas.height;
        this.start = new Vec2(0, 0);
        this.end = new Vec2(width, height);

        const canvasBounds: Vec2[] = [this.start.clone(), new Vec2(width, 0), this.end.clone(), new Vec2(0, height), this.start.clone()];

        let samePoints = canvasBounds.length === this.configLasso.points.length;
        for (let i = 0; i < canvasBounds.length && samePoints; i++) {
            if (!this.configLasso.points[i].equals(canvasBounds[i])) {
                samePoints = false;
            }
        }

        if (!samePoints) {
            this.configLasso.points = canvasBounds;
            this.onClosedPath();
        }
    }

    stopDrawing(): void {
        super.stopDrawing();
        this.initAttribs(new LassoConfig());
    }

    private onClosedPath(): void {
        this.endSelection();
        this.selectionResize.stopDrawing();
        this.selectionTranslation.stopDrawing();
        this.mouseDownCoord = this.start;
        this.mouseUpCoord = this.end;
        const size: Vec2 = this.end.substract(this.start);

        this.configLasso.originalPoints = [];
        this.configLasso.points.forEach((point) => {
            this.configLasso.originalPoints.push(point.clone());
        });

        this.configLasso.width = size.x;
        this.configLasso.height = size.y;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.configLasso.isInSelection = true;

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
        this.initAttribs(new LassoConfig());
    }

    private drawPreview(): void {
        const command = new LassoDraw(this.colorService, this.configLasso);
        this.drawingService.drawPreview(command);
    }

    protected endSelection(): void {
        if (this.configLasso.previewSelectionCtx === null) return;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.draw();

        this.UPDATE_POINTS.next(false);
        this.initAttribs(new LassoConfig());
        this.config.previewSelectionCtx = null;
        this.config.endCoords = new Vec2(0, 0);
        this.config.markedForDelete = false;
        this.config.markedForPaste = false;
    }

    protected fillBackground(ctx: CanvasRenderingContext2D): void {
        if (!this.configLasso.didChange()) return;

        ctx.fillStyle = Colors.WHITE.rgbString;
        LineDrawer.drawFilledLinePath(ctx, this.configLasso.originalPoints);
    }

    protected updateSelectionRequired(): void {
        const selectionTranslation = this.configLasso.endCoords.substract(this.configLasso.startCoords);
        for (let i = 0; i < this.configLasso.points.length; ++i) {
            const resizeFactor = new Vec2(
                Math.abs(this.configLasso.width / this.configLasso.originalWidth),
                Math.abs(this.configLasso.height / this.configLasso.originalHeight),
            );

            const relativePosition = this.configLasso.originalPoints[i].substract(this.configLasso.startCoords);

            relativePosition.x *= resizeFactor.x * this.configLasso.scaleFactor.x;
            relativePosition.y *= resizeFactor.y * this.configLasso.scaleFactor.y;

            if (this.configLasso.scaleFactor.x < 0) relativePosition.x += Math.abs(this.configLasso.width);
            if (this.configLasso.scaleFactor.y < 0) relativePosition.y += Math.abs(this.configLasso.height);

            this.configLasso.points[i] = this.configLasso.startCoords.add(relativePosition).add(selectionTranslation);
        }

        const ctx = this.drawingService.previewCtx;
        LassoDraw.drawClippedSelection(ctx, this.configLasso);
        LineDrawer.drawDashedLinePath(ctx, this.configLasso.points);
    }
}
