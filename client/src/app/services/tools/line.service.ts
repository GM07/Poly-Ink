import { Injectable } from '@angular/core';
import { LineDraw } from '@app/classes/commands/line-draw';
import { LineDrawer } from '@app/classes/line-drawer';
import { Geometry } from '@app/classes/math/geometry';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { LineConfig } from '@app/classes/tool-config/line-config';
import { LineToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { MouseButton } from '@app/constants/control';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    lineDrawer: LineDrawer;
    config: LineConfig;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.config = new LineConfig();
        this.lineDrawer = new LineDrawer(this.config, drawingService);
        this.lineDrawer.drawPreview.subscribe(() => {
            this.drawPreview();
        });

        this.shortcutKey = new ShortcutKey(LineToolConstants.SHORTCUT_KEY);
        this.toolID = LineToolConstants.TOOL_ID;
    }

    initService(): void {
        this.lineDrawer.init(new LineConfig());
        this.config.closedLoop = false;
    }

    onMouseDown(event: MouseEvent): void {
        if (event.detail === 1) {
            this.handleSimpleClick(event);
        } else if (event.detail === 2) {
            this.handleDoubleClick(event);
        }
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.lineDrawer.leftMouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.config.points.length === 0 || event.clientX === undefined || event.clientY === undefined) {
            return;
        }

        this.lineDrawer.followCursor(event);
    }

    onKeyDown(event: KeyboardEvent): void {
        const shortcut = ShortcutKey.get(this.lineDrawer.SHORTCUT_LIST, event, true);
        if (shortcut !== undefined && shortcut.isDown !== true) {
            shortcut.isDown = true;
            this.lineDrawer.handleKeys(shortcut);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        this.lineDrawer.shift.isDown = event.shiftKey;

        const shortcut = ShortcutKey.get(this.lineDrawer.SHORTCUT_LIST, event, true);
        if (shortcut !== undefined) {
            shortcut.isDown = false;
            this.lineDrawer.handleKeys(shortcut);
        }
    }

    stopDrawing(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.unblockUndoRedo();
        this.initService();
    }

    draw(): void {
        const command = new LineDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    drawPreview(): void {
        const command = new LineDraw(this.colorService, this.config);
        this.drawingService.drawPreview(command);
    }

    private handleSimpleClick(event: MouseEvent): void {
        this.lineDrawer.leftMouseDown = event.button === MouseButton.Left;
        if (this.lineDrawer.leftMouseDown) {
            this.lineDrawer.addNewPoint(event);
        }
    }

    private handleDoubleClick(event: MouseEvent): void {
        const mousePos = this.getPositionFromMouse(event);
        this.lineDrawer.pointToAdd = this.lineDrawer.shift.isDown ? this.lineDrawer.getAlignedPoint(mousePos) : mousePos;

        const closedLoop: boolean =
            Geometry.getDistanceBetween(this.lineDrawer.pointToAdd, this.config.points[0]) <= ToolSettingsConst.MINIMUM_DISTANCE_TO_CLOSE_PATH;

        if (closedLoop) {
            this.config.points[this.config.points.length - 1] = this.config.points[0];
        }
        this.config.closedLoop = closedLoop;

        this.draw();

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.initService();
    }
}
