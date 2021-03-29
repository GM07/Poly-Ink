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
    config: LassoConfig;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(LassoToolConstants.SHORTCUT_KEY);
        this.toolID = LassoToolConstants.TOOL_ID;
        this.config = new LassoConfig();
        this.lineDrawer = new LineDrawer(drawingService, this.config);
        this.lineDrawer.drawPreview.subscribe(() => {
            this.drawPreview();
        });
    }

    onMouseDown(event: MouseEvent): void {
        this.lineDrawer.leftMouseDown = event.button === MouseButton.Left;
        this.leftMouseDown = this.lineDrawer.leftMouseDown;

        if (!this.lineDrawer.leftMouseDown) return;

        if (this.selectionCtx === null) {
            this.lineDrawer.pointToAdd = this.getPositionFromMouse(event);

            if (this.config.points.length > 2) {
                const closedLoop: boolean =
                    Geometry.getDistanceBetween(this.lineDrawer.pointToAdd, this.config.points[0]) <=
                    ToolSettingsConst.MINIMUM_DISTANCE_TO_CLOSE_PATH;

                if (closedLoop) {
                    this.config.points.push(this.config.points[0]);
                    const [start, end] = this.findSmallestRectangle();
                    this.mouseDownCoord = start;
                    this.mouseUpCoord = end;
                    this.startSelection();
                } else {
                    this.lineDrawer.addNewPoint(event);
                }
            } else {
                this.lineDrawer.addNewPoint(event);
            }
        } else {
            this.updateSelectionRequired();
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.config.points.length === 0 || event.clientX === undefined || event.clientY === undefined) {
            return;
        }

        if (this.leftMouseDown) {
            if (this.selectionCtx !== null) {
                this.updateSelection(this.getTranslation(this.mouseUpCoord));
                document.body.style.width = event.pageX + this.config.width + 'px';
                document.body.style.height = event.pageY + this.config.height + 'px';
            }
        } else if (this.selectionCtx === null) {
            this.lineDrawer.followCursor(event);
        }
    }

    onKeyDown(event: KeyboardEvent): void {
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
        this.config.points.forEach((point) => {
            start.x = point.x < start.x ? point.x : start.x;
            start.y = point.y < start.y ? point.y : start.y;
            end.x = point.x > end.x ? point.x : end.x;
            end.y = point.y > end.y ? point.y : end.y;
        });

        const size: Vec2 = end.substract(start);

        this.config.startCoords = start;
        this.config.endCoords = end;
        this.config.width = size.x;
        this.config.height = size.y;

        return [start, end];
    }

    draw(): void {
        const command = new LassoDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    drawPreview(): void {
        const command = new LassoDraw(this.colorService, this.config);
        this.drawingService.drawPreview(command);
    }

    drawPreviewSelectionRequired(): void {
        if (this.config.points.length === 0) return;

        const corners: Vec2[] = this.findSmallestRectangle();
        const position: Vec2 = corners[0];
        const end: Vec2 = corners[1];
        const size: Vec2 = end.substract(position);
        this.drawSelection(this.drawingService.previewCtx, position, size);
    }

    protected endSelection(): void {
        if (this.selectionCtx === null) return;

        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        this.draw();

        this.selectionCtx = null;

        this.config.endCoords = new Vec2(0, 0);
        this.translationOrigin = new Vec2(0, 0);
    }

    protected fillBackground(ctx: CanvasRenderingContext2D, currentPos: Vec2): void {
        // Fill la partie selectionnee en blanc
        // if (!this.config.startCoords.equals(currentPos)) {
        //     ctx.beginPath();
        //     ctx.fillStyle = 'white';
        //     ctx.fillRect(this.config.startCoords.x, this.config.startCoords.y, Math.abs(this.config.width), Math.abs(this.config.height));
        //     ctx.closePath();
        // }
    }

    protected updateSelectionRequired(): void {
        const ctx = this.drawingService.previewCtx;
        this.drawingService.clearCanvas(ctx);

        this.fillBackground(ctx, this.config.endCoords);

        ctx.drawImage(this.SELECTION_DATA, this.config.endCoords.x, this.config.endCoords.y);
        this.drawSelection(ctx, this.config.startCoords, new Vec2(Math.abs(this.config.width), Math.abs(this.config.height)));
    }

    protected drawSelection(ctx: CanvasRenderingContext2D, position: Vec2, size: Vec2): void {
        ctx.lineWidth = this.BORDER_WIDTH;
        ctx.setLineDash([this.LINE_DASH, this.LINE_DASH]);
        ctx.strokeStyle = 'black';
        ctx.lineJoin = 'miter' as CanvasLineJoin;
        ctx.lineCap = 'square' as CanvasLineCap;

        ctx.strokeRect(position.x, position.y, size.x, size.y);
        ctx.lineDashOffset = this.LINE_DASH;
        ctx.strokeStyle = 'white';
        ctx.strokeRect(position.x, position.y, size.x, size.y);

        ctx.lineDashOffset = 0;
        ctx.setLineDash([]);
    }
}
