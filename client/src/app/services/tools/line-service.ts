import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolSettings } from '@app/classes/tool_settings/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool { //implements AbstractThicknessComponent, AbstractTraceTypeComponent
    public lineWidth: number;
    private traceType: string;
    private avecPoint: boolean;
    getSettings(): ToolSettings {
        throw new Error('Method not implemented.');
    }


    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortCutKey = 'l';
        this.lineWidth;
        // Doit changer ça...
        this.traceType;
        this.avecPoint;
    }

    stopDrawing(): void {
        // Clear
    }
}
