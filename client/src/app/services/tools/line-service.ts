import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { getAngle, getDistanceBetween, Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    readonly ANGLE_STEPS = 45;
    private points: Vec2[] = [];
    private pointToAdd: Vec2;

    // Temporaire en attendant la configuration de l'outil
    private strokeStyle: string = 'black';
    private fillStyle: string = 'red';

    // On fait une sauvegarde temporaire de la position de la souris
    // dans le cas d'un event de clavier qui genere une fonctionnalitee
    // qui necessite la position de la souris (Shift)
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

    setupDrawingStyle() {
        this.drawingService.previewCtx.strokeStyle = this.strokeStyle;
        this.drawingService.previewCtx.fillStyle = this.fillStyle;
        this.drawingService.baseCtx.strokeStyle = this.strokeStyle;
        this.drawingService.baseCtx.fillStyle = this.fillStyle;
    }

    onMouseDown(event: MouseEvent): void {
        if (!(this.mouseDown = event.button === MouseButton.Left)) {
            return;
        }

        if (this.pointToAdd === undefined || this.points.length === 0) {
            this.pointToAdd = this.getPositionFromMouse(event);
        }

        this.points.push(this.pointToAdd);
    }

    onDoubleClick(event: MouseEvent): void {
        if (this.points.length == 0) {
            return;
        }

        let point: Vec2 = this.getPositionFromMouse(event);
        let firstPoint: Vec2 = this.getFirstPoint();
        let closedLoop: boolean = getDistanceBetween(point, firstPoint) <= 20;
        this.drawPath(this.drawingService.baseCtx, this.points, closedLoop);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.points = [];
    }

    onMouseMove(event: MouseEvent): void {
        if (this.points.length == 0 || !this.mouseDown) {
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
        if (currentKey === 'Backspace' && this.keyEvents.get('Backspace')) {
            if (this.points.length >= 1) {
                this.points.pop();
            }
            if (this.points.length === 0) {
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
            }
        }

        if (this.keyEvents.get('Shift')) {
            this.pointToAdd = this.alignPoint();
            this.handleLinePreview();
        } else if (currentKey === 'Shift') {
            this.pointToAdd = this.mousePosition;
            this.handleLinePreview();
        }

        if (currentKey === 'Escape' && this.keyEvents.get('Escape')) {
            this.points = [];
            this.drawingService.clearCanvas(this.drawingService.previewCtx);
        }
    }

    stopDrawing(): void {
        this.onMouseUp({} as MouseEvent);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }

    handleLinePreview() {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        // On redessine le path sur le preview en ajoutant une ligne jusqu'au curseur
        this.drawPath(this.drawingService.previewCtx);
        let lastPoint: Vec2 = this.getLastPoint();
        this.drawLine(this.drawingService.previewCtx, lastPoint, this.pointToAdd);
    }

    alignPoint(cursor: Vec2 = this.mousePosition): Vec2 {
        let angle: number = getAngle(this.getLastPoint(), cursor) + Math.PI / 8;
        let finalAngle = (Math.floor(angle / (Math.PI / 4)) * Math.PI) / 4;

        let distance = getDistanceBetween(this.getLastPoint(), cursor);
        let dx = distance * Math.cos(finalAngle) + this.getLastPoint().x;
        let dy = -(distance * Math.sin(finalAngle)) + this.getLastPoint().y;

        return { x: Math.round(dx), y: Math.round(dy) };
    }

    private drawLine(ctx: CanvasRenderingContext2D, initial: Vec2, final: Vec2): void {
        ctx.beginPath();
        ctx.moveTo(initial.x, initial.y);
        ctx.lineTo(final.x, final.y);
        ctx.stroke();
    }

    private drawPath(ctx: CanvasRenderingContext2D, points: Vec2[] = this.points, closed: boolean = false): void {
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
            let beginPoint: Vec2 = this.getFirstPoint();
            ctx.lineTo(beginPoint.x, beginPoint.y);
            ctx.stroke();
        }
    }

    private getLastPoint(): Vec2 {
        return this.points[this.points.length - 1];
    }

    private getFirstPoint(): Vec2 {
        return this.points[0];
    }
}
