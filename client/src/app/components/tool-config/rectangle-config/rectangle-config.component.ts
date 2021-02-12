import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { RectangleMode, RectangleService } from '@app/services/tools/rectangle-service';

@Component({
    selector: 'app-rectangle-config',
    templateUrl: './rectangle-config.component.html',
    styleUrls: ['./rectangle-config.component.scss'],
})
export class RectangleConfigComponent extends ToolConfig {
    rectangleModeIn: typeof RectangleMode = RectangleMode;
    traceTypeIn: RectangleMode;
    readonly MIN: number = ToolSettingsConst.MIN_RECTANGLE_WIDTH;
    readonly MAX: number = ToolSettingsConst.MAX_WIDTH;
    

    constructor(public rectangleService: RectangleService) {
        super();
        this.traceTypeIn = RectangleMode.Contour;
    }

    toggleTraceType(rectangleMode: RectangleMode): void {
        this.traceTypeIn = rectangleMode;
        this.rectangleService.rectangleMode = rectangleMode;
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
