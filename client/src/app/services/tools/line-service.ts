import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { LineToolConstants } from '@app/classes/tool_settings/tools.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    readonly toolID: string = LineToolConstants.TOOL_ID;
    constructor(drawingService: DrawingService) {
        super(drawingService);
        this.shortCutKey = 'l';
    }

    stopDrawing(): void {
        // Clear
    }
}
