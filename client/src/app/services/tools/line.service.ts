import { Injectable } from '@angular/core';
import { LineDraw } from '@app/classes/commands/line-draw';
import { Geometry } from '@app/classes/math/geometry';
import { ShiftKey } from '@app/classes/shortcut/shift-key';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Tool } from '@app/classes/tool';
import { LineConfig } from '@app/classes/tool-config/line-config';
import { LineToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/control';
import { ToolMath } from '@app/constants/math';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private static readonly ANGLE_STEPS: number = Math.PI / (2 * 2); // Lint...
    private readonly SHIFT: ShiftKey = new ShiftKey();
    private readonly ESCAPE: ShortcutKey = new ShortcutKey('escape');
    private readonly BACKSPACE: ShortcutKey = new ShortcutKey('backspace');
    private readonly SHORTCUT_LIST: ShortcutKey[] = [this.ESCAPE, this.BACKSPACE, this.SHIFT];
    private mousePosition: Vec2;
    private pointToAdd: Vec2;

    config: LineConfig;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(LineToolConstants.SHORTCUT_KEY);
        this.toolID = LineToolConstants.TOOL_ID;
        this.config = new LineConfig();
    }

    initService(): void {
        this.SHIFT.isDown = false;
        this.ESCAPE.isDown = false;
        this.BACKSPACE.isDown = false;
        this.config.closedLoop = false;
        this.config.points = [];
        this.pointToAdd = {} as Vec2;
        this.mousePosition = {} as Vec2;
    }

    onMouseDown(event: MouseEvent): void {
        if (event.detail === 1) {
            this.handleSimpleClick(event);
        } else if (event.detail === 2) {
            this.handleDoubleClick(event);
        }
    }

    private handleSimpleClick(event: MouseEvent): void {
        this.leftMouseDown = event.button === MouseButton.Left;
        if (this.leftMouseDown) {
            if (this.config.points.length === 0 || this.pointToAdd === undefined) {
                this.pointToAdd = this.getPositionFromMouse(event);
            }

            this.config.points.push(this.pointToAdd);
        }
    }

    private handleDoubleClick(event: MouseEvent): void {
        if (!this.SHIFT.isDown) {
            this.pointToAdd = this.getPositionFromMouse(event);
        } else {
            this.pointToAdd = this.alignPoint(this.getPositionFromMouse(event));
        }

        const closedLoop: boolean =
            Geometry.getDistanceBetween(this.pointToAdd, this.config.points[0]) <= ToolSettingsConst.MINIMUM_DISTANCE_TO_CLOSE_PATH;

        if (closedLoop) {
            this.config.points[this.config.points.length - 1] = this.config.points[0];
        }
        this.config.closedLoop = closedLoop;

        this.draw();

        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.initService();
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button === MouseButton.Left) {
            this.leftMouseDown = false;
        }
    }

    onMouseMove(event: MouseEvent): void {
        if (this.config.points.length === 0 || event.clientX === undefined || event.clientY === undefined) {
            return;
        }

        let point: Vec2 = (this.mousePosition = this.getPositionFromMouse(event));
        if (this.SHIFT.isDown) {
            point = this.alignPoint(point);
        }

        this.pointToAdd = point;
        this.handleLinePreview();
    }

    onKeyDown(event: KeyboardEvent): void {
        const shortcut = ShortcutKey.get(this.SHORTCUT_LIST, event, true);
        if (shortcut !== undefined && shortcut.isDown !== true) {
            shortcut.isDown = true;
            this.handleKeys(shortcut);
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        this.SHIFT.isDown = event.shiftKey;

        const shortcut = ShortcutKey.get(this.SHORTCUT_LIST, event, true);
        if (shortcut !== undefined) {
            shortcut.isDown = false;
            this.handleKeys(shortcut);
        }
    }

    private handleKeys(shortcutKey: ShortcutKey): void {
        if (this.config.points.length === 0) {
            return;
        }

        switch (shortcutKey) {
            case this.ESCAPE:
                this.handleEscapeKey();
                break;
            case this.BACKSPACE:
                this.handleBackspaceKey();
                break;
            case this.SHIFT:
                this.handleShiftKey();
                break;
        }
    }

    private handleBackspaceKey(): void {
        if (this.BACKSPACE.isDown) {
            if (this.config.points.length >= 2) {
                this.config.points.pop();
                this.handleLinePreview();
            }
        }
    }

    private handleShiftKey(): void {
        if (this.leftMouseDown) return;

        if (this.SHIFT.isDown) {
            this.pointToAdd = this.alignPoint(this.mousePosition);
        } else {
            this.pointToAdd = this.mousePosition;
        }
        this.handleLinePreview();
    }

    private handleEscapeKey(): void {
        if (this.ESCAPE.isDown) {
            this.config.points = [];
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.unblockUndoRedo();
        }
    }

    stopDrawing(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawingService.unblockUndoRedo();
        this.initService();
    }

    private handleLinePreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.config.points.push(this.pointToAdd);

        this.drawPreview();

        this.config.points.pop();
    }

    private alignPoint(cursor: Vec2): Vec2 {
        const angle: number = Geometry.getAngle(this.getLastPoint(), cursor) + LineService.ANGLE_STEPS / 2;
        const finalAngle = Math.floor(angle / LineService.ANGLE_STEPS) * LineService.ANGLE_STEPS;

        const distanceX = cursor.x - this.getLastPoint().x;
        const distanceY = cursor.y - this.getLastPoint().y;
        let distance = Geometry.getDistanceBetween(this.getLastPoint(), cursor);

        if (Math.abs(Math.cos(finalAngle)) >= ToolMath.ZERO_THRESHOLD) {
            distance = Math.abs(distanceX / Math.cos(finalAngle));
        } else {
            distance = Math.abs(distanceY / Math.sin(finalAngle));
        }

        const dx = distance * Math.cos(finalAngle) + this.getLastPoint().x;
        const dy = -(distance * Math.sin(finalAngle)) + this.getLastPoint().y;

        return { x: Math.round(dx), y: Math.round(dy) } as Vec2;
    }

    private getLastPoint(): Vec2 {
        return this.config.points[this.config.points.length - 1];
    }

    draw(): void {
        const command = new LineDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    drawPreview(): void {
        const command = new LineDraw(this.colorService, this.config);
        this.drawingService.drawPreview(command);
    }
}
