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
    readonly MIN: number = ToolSettingsConst.MIN_WIDTH;
    readonly MAX: number = ToolSettingsConst.MAX_WIDTH;
    rectangleModeIn: typeof ShapeMode = ShapeMode;

    constructor(public rectangleService: RectangleService) {
        super();
    }

    toggleTraceType(rectangleMode: ShapeMode): void {
        this.rectangleService.config.shapeMode = rectangleMode;
    }

    changeContourWidth(event: MatSliderChange): void {
        this.rectangleService.contourWidth = event.value as number;
    }
}
