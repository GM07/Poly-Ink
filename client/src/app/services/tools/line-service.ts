import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { MouseButton } from './pencil-service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    private points: Vec2[];

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortCutKey = 'l';
    }

    onMouseDown(event: MouseEvent): void {
        if (!(this.mouseDown = event.button === MouseButton.Left)) {
            return;
        }

        if (this.points.length == 0) {
            this.points.push(this.getPositionFromMouse(event));
        }
    }

    onMouseUp(event: MouseEvent): void {
        //
    }

    onMouseMove(event: MouseEvent): void {
        //
    }

    onMouseLeave(event: MouseEvent): void {
        //
    }

    onMouseEnter(event: MouseEvent): void {
        //
    }

    onKeyPress(event: KeyboardEvent): void {
        //
    }

    stopDrawing(): void {}

    getPositionFromMouse(event: MouseEvent): Vec2 {
        return { x: event.offsetX, y: event.offsetY };
    }
}
