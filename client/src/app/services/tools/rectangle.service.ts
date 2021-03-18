import { Injectable } from '@angular/core';
import { RectangleDraw } from '@app/classes/commands/rectangle-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { RectangleToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { AbstractShape } from './abstract-shape.service';
@Injectable({
    providedIn: 'root',
})
export class RectangleService extends AbstractShape {
    readonly toolID: string = RectangleToolConstants.TOOL_ID;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(RectangleToolConstants.SHORTCUT_KEY);
        this.toolID = RectangleToolConstants.TOOL_ID;
    }

    draw(): void {
        const command = new RectangleDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    drawPreview(): void {
        const command = new RectangleDraw(this.colorService, this.config);
        this.drawingService.drawPreview(command);
    }
}
