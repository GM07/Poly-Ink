import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ToolConfig } from '@app/classes/tool-config';
import { ShapeMode } from '@app/classes/tool-config/shape-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { RectangleService } from '@app/services/tools/rectangle.service';
@Component({
    selector: 'app-rectangle-config',
    templateUrl: './rectangle-config.component.html',
    styleUrls: ['./rectangle-config.component.scss'],
})
export class RectangleConfigComponent extends ToolConfig {
    rectangleModeIn: typeof ShapeMode = ShapeMode;
    readonly MIN: number = ToolSettingsConst.MIN_WIDTH;
    readonly MAX: number = ToolSettingsConst.MAX_WIDTH;

    constructor(public rectangleService: RectangleService) {
        super();
    }

    toggleTraceType(rectangleMode: ShapeMode): void {
        this.rectangleService.config.shapeMode = rectangleMode;
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }

    changeContourWidth(event: MatSliderChange): void {
        this.rectangleService.contourWidth = event.value as number;
    }
}
