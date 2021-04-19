import { Geometry } from '@app/classes/math/geometry';
import { ShiftKey } from '@app/classes/shortcut/shift-key';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Vec2 } from '@app/classes/vec2';
import { ToolMath } from '@app/constants/math';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { Subject } from 'rxjs';
import { AbstractLineConfig } from './tool-config/abstract-line-config';

export interface DashLineSettings {
    transform: Vec2;
    styles: string[];
}

export class LineDrawer {
    pointToAdd: Vec2;
    mousePosition: Vec2;
    shift: ShiftKey = new ShiftKey();
    readonly ESCAPE: ShortcutKey = new ShortcutKey('escape');
    readonly BACKSPACE: ShortcutKey = new ShortcutKey('backspace');
    readonly SHORTCUT_LIST: ShortcutKey[] = [this.ESCAPE, this.BACKSPACE, this.shift];
    drawPreview: Subject<void>;
    removeLine: Subject<void>;
    removeLines: Subject<void>;
    leftMouseDown: boolean;
    private config: AbstractLineConfig;
    private drawingService: DrawingService;

    constructor(config: AbstractLineConfig, drawingService: DrawingService) {
        this.config = config;
        this.drawingService = drawingService;
        this.drawPreview = new Subject<void>();
        this.removeLine = new Subject<void>();
        this.removeLines = new Subject<void>();
        this.leftMouseDown = false;
        this.init(config);
    }

    static drawFilledLinePath(ctx: CanvasRenderingContext2D, points: Vec2[], transform: Vec2 = new Vec2(0, 0)): void {
        LineDrawer.drawLinePath(ctx, points, transform);
        ctx.fill();
    }

    static drawClippedLinePath(ctx: CanvasRenderingContext2D, points: Vec2[], transform: Vec2 = new Vec2(0, 0)): void {
        LineDrawer.drawLinePath(ctx, points, transform);
        ctx.clip();
    }

    static drawDashedLinePath(
        ctx: CanvasRenderingContext2D,
        points: Vec2[],
        settings: DashLineSettings = { transform: new Vec2(0, 0), styles: ['black', 'white'] } as DashLineSettings,
    ): void {
        ctx.lineWidth = ToolSettingsConst.BORDER_WIDTH;
        ctx.setLineDash([ToolSettingsConst.LINE_DASH, ToolSettingsConst.LINE_DASH]);
        ctx.lineJoin = 'round' as CanvasLineJoin;
        ctx.lineCap = 'round' as CanvasLineCap;

        for (let index = 0; index < settings.styles.length; index++) {
            const style: string = settings.styles[index];
            ctx.lineDashOffset = index * ToolSettingsConst.LINE_DASH;
            ctx.strokeStyle = style;
            LineDrawer.drawStrokedLinePath(ctx, points, settings.transform);
        }
        ctx.closePath();
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;
    }

    private static drawLinePath(ctx: CanvasRenderingContext2D, points: Vec2[], transform: Vec2 = new Vec2(0, 0)): void {
        ctx.beginPath();
        const firstPoint: Vec2 = points[0].add(transform);
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (let index = 1; index < points.length; index++) {
            const point = points[index].add(transform);
            ctx.lineTo(point.x, point.y);
        }
    }
    private static drawStrokedLinePath(ctx: CanvasRenderingContext2D, points: Vec2[], transform: Vec2 = new Vec2(0, 0)): void {
        LineDrawer.drawLinePath(ctx, points, transform);
        ctx.stroke();
    }

    init(config: AbstractLineConfig): void {
        this.shift.isDown = false;
        this.ESCAPE.isDown = false;
        this.BACKSPACE.isDown = false;
        this.pointToAdd = new Vec2(-1, -1);
        this.mousePosition = new Vec2(-1, -1);
        this.config.points = config.points;
    }

    addNewPoint(event: MouseEvent): void {
        if (this.config.points.length === 0 || this.pointToAdd === undefined) {
            this.pointToAdd = this.getPositionFromMouse(event);
        }

        this.config.points.push(this.pointToAdd.clone());
    }

    followCursor(event: MouseEvent): void {
        let point: Vec2 = (this.mousePosition = this.getPositionFromMouse(event));
        if (this.shift.isDown) {
            point = this.getAlignedPoint(point);
        }

        this.pointToAdd = point;
        this.renderLinePreview();
    }

    getAlignedPoint(cursor: Vec2): Vec2 {
        const angle: number = Geometry.getAngle(this.getLastPoint(), cursor) + ToolSettingsConst.LINE_DRAWER_ANGLE_STEPS / 2;
        const finalAngle = Math.floor(angle / ToolSettingsConst.LINE_DRAWER_ANGLE_STEPS) * ToolSettingsConst.LINE_DRAWER_ANGLE_STEPS;

        const distance = cursor.substract(this.getLastPoint());
        let totalDistance = Geometry.getDistanceBetween(this.getLastPoint(), cursor);

        if (Math.abs(Math.cos(finalAngle)) >= ToolMath.ZERO_THRESHOLD) {
            totalDistance = Math.abs(distance.x / Math.cos(finalAngle));
        } else {
            totalDistance = Math.abs(distance.y / Math.sin(finalAngle));
        }

        const dx = totalDistance * Math.cos(finalAngle) + this.getLastPoint().x;
        const dy = -(totalDistance * Math.sin(finalAngle)) + this.getLastPoint().y;

        return new Vec2(Math.round(dx), Math.round(dy));
    }

    removeLastPoint(): void {
        if (this.BACKSPACE.isDown) {
            if (this.config.points.length >= 2) {
                this.config.points.pop();
                this.removeLine.next();
                this.renderLinePreview();
            }
        }
    }

    clearPoints(): void {
        if (this.ESCAPE.isDown) {
            this.config.points = [];
            this.removeLines.next();
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.unblockUndoRedo();
        }
    }

    handleKeys(shortcutKey: ShortcutKey): void {
        if (this.config.points.length === 0) {
            return;
        }

        switch (shortcutKey) {
            case this.ESCAPE:
                this.clearPoints();
                break;
            case this.BACKSPACE:
                this.removeLastPoint();
                break;
            case this.shift:
                this.alignNextPoint();
                break;
        }
    }

    renderLinePreview(): void {
        this.config.points.push(this.pointToAdd);

        this.drawPreview.next();

        this.config.points.pop();
    }

    private alignNextPoint(): void {
        if (this.leftMouseDown) return;

        this.pointToAdd = this.shift.isDown ? this.getAlignedPoint(this.mousePosition) : this.mousePosition.clone();
        this.renderLinePreview();
    }

    private getLastPoint(): Vec2 {
        return this.config.points[this.config.points.length - 1];
    }

    private getBorder(): number {
        const borderValue: string = window.getComputedStyle(this.drawingService.canvas).getPropertyValue('border-left-width');
        return Number(borderValue.substring(0, borderValue.length - 2));
    }

    private getPositionFromMouse(event: MouseEvent): Vec2 {
        const clientRect = this.drawingService.canvas.getBoundingClientRect();
        const border: number = this.getBorder();
        return new Vec2(event.clientX - clientRect.x, event.clientY - clientRect.y).substractValue(border);
    }
}
