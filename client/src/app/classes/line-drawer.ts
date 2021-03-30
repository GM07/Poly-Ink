import { Geometry } from '@app/classes/math/geometry';
import { ShiftKey } from '@app/classes/shortcut/shift-key';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { Vec2 } from '@app/classes/vec2';
import { ToolMath } from '@app/constants/math';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractSelectionService } from '@app/services/tools/abstract-selection.service';
import { Subject } from 'rxjs';
import { AbstractLineConfig } from './tool-config/abstract-line-config';

export class LineDrawer {
    protected static readonly ANGLE_STEPS: number = Math.PI / (2 * 2); // Lint...x

    pointToAdd: Vec2;
    mousePosition: Vec2;
    shift: ShiftKey = new ShiftKey();
    escape: ShortcutKey = new ShortcutKey('escape');
    backspace: ShortcutKey = new ShortcutKey('backspace');
    shortcutList: ShortcutKey[] = [this.escape, this.backspace, this.shift];

    private config: AbstractLineConfig;
    public drawPreview: Subject<void>;
    public leftMouseDown: boolean;
    private drawingService: DrawingService;

    constructor(config: AbstractLineConfig, drawingService: DrawingService) {
        this.config = config;
        this.drawingService = drawingService;
        this.drawPreview = new Subject<void>();
        this.leftMouseDown = false;
        this.init();
    }

    init() {
        this.shift.isDown = false;
        this.escape.isDown = false;
        this.backspace.isDown = false;
        this.pointToAdd = {} as Vec2;
        this.mousePosition = {} as Vec2;
        this.config.points = [];
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

        this.pointToAdd = point.clone();
        this.renderLinePreview();
    }

    drawCurrentPath(): void {
        this.drawPreview.next();
    }

    getAlignedPoint(cursor: Vec2): Vec2 {
        const angle: number = Geometry.getAngle(this.getLastPoint(), cursor) + LineDrawer.ANGLE_STEPS / 2;
        const finalAngle = Math.floor(angle / LineDrawer.ANGLE_STEPS) * LineDrawer.ANGLE_STEPS;

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

    renderLinePreview(): void {
        this.config.points.push(this.pointToAdd);

        this.drawPreview.next();

        this.config.points.pop();
    }

    removeLastPoint(): void {
        if (this.backspace.isDown) {
            if (this.config.points.length >= 2) {
                this.config.points.pop();
                this.renderLinePreview();
            }
        }
    }

    alignNextPoint(): void {
        // if (this.leftMouseDown) return;

        if (this.shift.isDown) {
            this.pointToAdd = this.getAlignedPoint(this.mousePosition);
        } else {
            this.pointToAdd = this.mousePosition.clone();
        }
        this.renderLinePreview();
    }

    clearPoints(): void {
        if (this.escape.isDown) {
            this.config.points = [];
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
            this.drawingService.unblockUndoRedo();
        }
    }

    handleKeys(shortcutKey: ShortcutKey): void {
        if (this.config.points.length === 0) {
            return;
        }

        switch (shortcutKey) {
            case this.escape:
                this.clearPoints();
                break;
            case this.backspace:
                this.removeLastPoint();
                break;
            case this.shift:
                this.alignNextPoint();
                break;
        }
    }

    getLastPoint(): Vec2 {
        return this.config.points[this.config.points.length - 1];
    }

    private getBorder(): number {
        const borderValue: string = window.getComputedStyle(this.drawingService.canvas).getPropertyValue('border-left-width');
        return Number(borderValue.substring(0, borderValue.length - 2));
    }

    getPositionFromMouse(event: MouseEvent): Vec2 {
        const clientRect = this.drawingService.canvas.getBoundingClientRect();
        const border: number = this.getBorder();
        return new Vec2(event.clientX - clientRect.x, event.clientY - clientRect.y).substractValue(border);
    }

    static drawLinePath(ctx: CanvasRenderingContext2D, points: Vec2[], transform: Vec2 = new Vec2(0, 0)) {
        ctx.beginPath();
        const firstPoint: Vec2 = points[0].add(transform);
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (let index = 1; index < points.length; index++) {
            const point = points[index].add(transform);
            ctx.lineTo(point.x, point.y);
        }
    }

    static drawFilledLinePath(ctx: CanvasRenderingContext2D, points: Vec2[], transform: Vec2 = new Vec2(0, 0)) {
        LineDrawer.drawLinePath(ctx, points, transform);
        ctx.fill();
    }

    static drawStrokedLinePath(ctx: CanvasRenderingContext2D, points: Vec2[], transform: Vec2 = new Vec2(0, 0)) {
        LineDrawer.drawLinePath(ctx, points, transform);
        ctx.stroke();
    }

    static drawClippedLinePath(ctx: CanvasRenderingContext2D, points: Vec2[], transform: Vec2 = new Vec2(0, 0)) {
        LineDrawer.drawLinePath(ctx, points, transform);
        ctx.clip();
    }

    static drawDashedLinePath(
        ctx: CanvasRenderingContext2D,
        points: Vec2[],
        transform: Vec2 = new Vec2(0, 0),
        styles: string[] = ['black', 'white'],
    ) {
        ctx.lineWidth = AbstractSelectionService.BORDER_WIDTH;
        ctx.setLineDash([AbstractSelectionService.LINE_DASH, AbstractSelectionService.LINE_DASH]);
        ctx.lineJoin = 'round' as CanvasLineJoin;
        ctx.lineCap = 'round' as CanvasLineCap;

        for (let index = 0; index < styles.length; index++) {
            const style: string = styles[index];
            ctx.lineDashOffset = index * AbstractSelectionService.LINE_DASH;
            ctx.strokeStyle = style;
            LineDrawer.drawStrokedLinePath(ctx, points, transform);
        }
        ctx.closePath();
        ctx.lineDashOffset = 0;
    }
}
