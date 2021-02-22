import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { PolygoneToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { ColorService } from 'src/color-picker/services/color.service';
import { DrawingService } from '../drawing/drawing.service';

export enum PolygoneMode {
    Contour = 0,
    Filled = 1,
    FilledWithContour = 2,
}

@Injectable({
    providedIn: 'root',
})
export class PolygoneService extends Tool {
    toolID: string = PolygoneToolConstants.TOOL_ID;
    // private shiftPressed: boolean;
    private lineWidthIn: number;
    polygoneMode: PolygoneMode;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = PolygoneToolConstants.SHORTCUT_KEY;
        // this.shiftPressed = false;
        this.lineWidthIn = 1;
        this.polygoneMode = PolygoneMode.FilledWithContour;
    }

    set contourWidth(width: number) {
        const max = 50;
        this.lineWidthIn = Math.min(Math.max(width, 1), max);
    }

    get contourWidth(): number {
        return this.lineWidthIn;
    }

    stopDrawing(): void {
        this.mouseDown = false;
        // this.shiftPressed = false;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
    }
}
