import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { EllipseSelectionToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { ColorService } from 'src/color-picker/services/color.service';
import { DrawingService } from '../drawing/drawing.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseSelectionService extends Tool {
    stopDrawing(): void {}

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = EllipseSelectionToolConstants.SHORTCUT_KEY;
        this.toolID = EllipseSelectionToolConstants.TOOL_ID;
    }
}
