import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ToolSettings } from '@app/classes/tool_settings/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    // implements AbstractThicknessComponent, AbstractTraceTypeComponent
    lineWidth: number;
    getSettings(): ToolSettings {
        throw new Error('Method not implemented.');
    }

    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortCutKey = 'l';
        // Doit changer ça...
    }

    stopDrawing(): void {
        // Clear
    }
}
