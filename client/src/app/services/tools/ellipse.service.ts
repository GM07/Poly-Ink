import { Injectable } from '@angular/core';
import { EllipseDraw } from '@app/classes/commands/ellipse-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { EllipseToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { AbstractShape } from './abstract-shape.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends AbstractShape {
    readonly toolID: string = EllipseToolConstants.TOOL_ID;

    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(EllipseToolConstants.SHORTCUT_KEY);
        this.toolID = EllipseToolConstants.TOOL_ID;
    }

    draw(): void {
        this.config.showPerimeter = false;
        const command = new EllipseDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    drawPreview(): void {
        this.config.showPerimeter = true;
        const command = new EllipseDraw(this.colorService, this.config);
        this.drawingService.drawPreview(command);
    }
}
