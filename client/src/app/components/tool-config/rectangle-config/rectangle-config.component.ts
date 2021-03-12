import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { Mode } from '@app/services/tools/abstract-shape.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
@Component({
    selector: 'app-rectangle-config',
    templateUrl: './rectangle-config.component.html',
    styleUrls: ['./rectangle-config.component.scss'],
})
export class RectangleConfigComponent extends ToolConfig {
    rectangleModeIn: typeof Mode = Mode;
    readonly MIN: number = ToolSettingsConst.MIN_WIDTH;
    readonly MAX: number = ToolSettingsConst.MAX_WIDTH;

    constructor(public rectangleService: RectangleService) {
        super();
    }

    toggleTraceType(rectangleMode: Mode): void {
        this.rectangleService.mode = rectangleMode;
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
