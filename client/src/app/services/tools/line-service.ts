import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool { //implements AbstractThicknessComponent, AbstractTraceTypeComponent
    private lineWidthIn: number;
    private traceType: string;
    private avecPoint: boolean;

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortCutKey = 'l';
        this.lineWidthIn;
        // Doit changer ça...
        this.traceType;
        this.avecPoint;
    }

    stopDrawing(): void {
        // Clear
    }
}
