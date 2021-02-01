import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    readonly name: string = 'line';
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortCutKey = 'l';
    }

    stopDrawing(): void {
        // Clear
    }
}
