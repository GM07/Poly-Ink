import { Injectable } from '@angular/core';
import { PolygonDraw } from '@app/classes/commands/polygon-draw';
import { ShortcutKey } from '@app/classes/shortcut/shortcut-key';
import { PolygoneToolConstants } from '@app/classes/tool_ui_settings/tools.constants';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { AbstractShape } from '@app/services/tools/abstract-shape.service';
import { ColorService } from 'src/color-picker/services/color.service';

@Injectable({
    providedIn: 'root',
})
export class PolygoneService extends AbstractShape {
    constructor(drawingService: DrawingService, colorService: ColorService) {
        super(drawingService, colorService);
        this.shortcutKey = new ShortcutKey(PolygoneToolConstants.SHORTCUT_KEY);
        this.toolID = PolygoneToolConstants.TOOL_ID;
    }

    set numEdges(numEdges: number) {
        if (numEdges >= ToolSettingsConst.MIN_NUM_EDGES && numEdges <= ToolSettingsConst.MAX_NUM_EDGES) {
            this.config.numEdges = numEdges;
        }
    }

    get numEdges(): number {
        return this.config.numEdges;
    }

    draw(): void {
        this.config.showPerimeter = false;
        const command = new PolygonDraw(this.colorService, this.config);
        this.drawingService.draw(command);
    }

    drawPreview(): void {
        this.config.showPerimeter = true;
        const command = new PolygonDraw(this.colorService, this.config);
        this.drawingService.drawPreview(command);
    }
}
