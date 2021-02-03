import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { GeometryService } from '../math/geometry.service';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    static readonly ANGLE_STEPS: number = Math.PI / (2 * 2); // Lint...
    static readonly MINIMUM_DISTANCE_TO_CLOSE_PATH: number = 20;
    private points: Vec2[] = [];
    private pointToAdd: Vec2;
    private strokeStyle: string = 'black';
    private mousePosition: Vec2;

    private keyEvents: Map<string, boolean> = new Map([
        ['Shift', false],
        ['Escape', false],
        ['Backspace', false],
    ]);

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortCutKey = 'l';
    }

    setupDrawingStyle(): void {
        this.drawingService.previewCtx.strokeStyle = this.strokeStyle;
        this.drawingService.baseCtx.strokeStyle = this.strokeStyle;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = event.button === MouseButton.Left;
        if (this.mouseDown) {
            if (this.pointToAdd === undefined || this.points.length === 0) {
                this.pointToAdd = this.getPositionFromMouse(event);
            }

            this.points.push(this.pointToAdd);
        }
    }

    onDoubleClick(event: MouseEvent): void {
        if (this.points.length === 0) {
            return;
        }

        this.pointToAdd = this.getPositionFromMouse(event);
        const closedLoop: boolean = GeometryService.getDistanceBetween(this.pointToAdd, this.points[0]) <= LineService.MINIMUM_DISTANCE_TO_CLOSE_PATH;
        this.drawLinePath(this.drawingService.baseCtx, this.points, closedLoop);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.points = [];
    }

    onMouseMove(event: MouseEvent): void {
        if (this.points.length === 0 || !this.mouseDown) {
            return;
        }
        let point: Vec2 = (this.mousePosition = this.getPositionFromMouse(event));

        if (this.keyEvents.get('Shift')) {
            point = this.alignPoint(point);
        }

        this.pointToAdd = point;
        this.handleLinePreview();
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.keyEvents.has(event.key)) {
            this.keyEvents.set(event.key, true);
        }
        this.handleKeys(event.key);
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.keyEvents.has(event.key)) {
            this.keyEvents.set(event.key, false);
        }

        this.handleKeys(event.key);
    }

    handleKeys(currentKey: string): void {
        if (this.points.length === 0) {
            return;
        }

        switch (currentKey) {
            case 'Escape':
                this.handleEscapeKey();
                break;
            case 'Backspace':
                this.handleBackspaceKey();
                break;
            case 'Shift':
                this.handleShiftKey();
            default:
                break;
        }
    }

    handleBackspaceKey(): void {
        if (this.keyEvents.get('Backspace')) {
            if (this.points.length >= 1) {
                this.points.pop();
            }
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    handleShiftKey(): void {
        if (this.keyEvents.get('Shift')) {
            this.pointToAdd = this.alignPoint();
            this.handleLinePreview();
        } else {
            this.pointToAdd = this.mousePosition;
            this.handleLinePreview();
        }
    }

    handleEscapeKey(): void {
        if (this.keyEvents.get('Escape')) {
            this.points = [];
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    stopDrawing(): void {
        this.onMouseUp({} as MouseEvent);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    handleLinePreview(): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawLinePath(this.drawingService.previewCtx);
        const lastPoint: Vec2 = this.getLastPoint();
        this.drawLine(this.drawingService.previewCtx, lastPoint, this.pointToAdd);
    }

    alignPoint(cursor: Vec2 = this.pointToAdd): Vec2 {
        const angle: number = GeometryService.getAngle(this.getLastPoint(), cursor) + LineService.ANGLE_STEPS / 2;
        const finalAngle = Math.floor(angle / LineService.ANGLE_STEPS) * LineService.ANGLE_STEPS;

        const distance = GeometryService.getDistanceBetween(this.getLastPoint(), cursor);
        const dx = distance * Math.cos(finalAngle) + this.getLastPoint().x;
        const dy = -(distance * Math.sin(finalAngle)) + this.getLastPoint().y;

        return { x: Math.round(dx), y: Math.round(dy) };
    }

    private drawLine(ctx: CanvasRenderingContext2D, initial: Vec2, final: Vec2): void {
        ctx.beginPath();
        ctx.moveTo(initial.x, initial.y);
        ctx.lineTo(final.x, final.y);
        ctx.stroke();
    }

    private drawLinePath(ctx: CanvasRenderingContext2D, points: Vec2[] = this.points, closed: boolean = false): void {
        for (let index = 0; index < points.length; index++) {
            const point = points[index];
            if (index === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            }
        }
        if (closed) {
            ctx.lineTo(this.points[0].x, this.points[0].y);
            ctx.stroke();
        }
    }

    private getLastPoint(): Vec2 {
        return this.points[this.points.length - 1];
    }
}
