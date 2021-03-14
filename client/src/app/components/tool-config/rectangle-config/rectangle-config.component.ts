import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { RectangleMode } from '@app/classes/tool-config/rectangle-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { RectangleService } from '@app/services/tools/rectangle.service';
@Component({
    selector: 'app-rectangle-config',
    templateUrl: './rectangle-config.component.html',
    styleUrls: ['./rectangle-config.component.scss'],
})
export class RectangleConfigComponent extends ToolConfig {
    rectangleModeIn: typeof RectangleMode = RectangleMode;
    readonly MIN: number = ToolSettingsConst.MIN_WIDTH;
    readonly MAX: number = ToolSettingsConst.MAX_WIDTH;

    constructor(public rectangleService: RectangleService) {
        super();
    }

    toggleTraceType(rectangleMode: RectangleMode): void {
        this.rectangleService.config.rectangleMode = rectangleMode;
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
