import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ToolConfig } from '@app/classes/tool-config';
import { ShapeMode } from '@app/classes/tool-config/shape-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { EllipseService } from '@app/services/tools/ellipse.service';
@Component({
    selector: 'app-ellipse-config',
    templateUrl: './ellipse-config.component.html',
    styleUrls: ['./ellipse-config.component.scss'],
})
export class EllipseConfigComponent extends ToolConfig {
    ellipseModeIn: typeof ShapeMode;
    readonly MIN: number = ToolSettingsConst.MIN_WIDTH;
    readonly MAX: number = ToolSettingsConst.MAX_WIDTH;

    constructor(public ellipseService: EllipseService) {
        super();
        this.ellipseModeIn = ShapeMode;
    }

    toggleTraceType(traceType: ShapeMode): void {
        this.ellipseService.config.shapeMode = traceType;
    }

    changeContourWidth(event: MatSliderChange): void {
        this.ellipseService.contourWidth = event.value as number;
    }
}
