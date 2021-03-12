import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { Mode } from '@app/services/tools/abstract-shape.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
@Component({
    selector: 'app-ellipse-config',
    templateUrl: './ellipse-config.component.html',
    styleUrls: ['./ellipse-config.component.scss'],
})
export class EllipseConfigComponent extends ToolConfig {
    ellipseModeIn: typeof Mode = Mode;
    readonly MIN: number = ToolSettingsConst.MIN_WIDTH;
    readonly MAX: number = ToolSettingsConst.MAX_WIDTH;

    constructor(public ellipseService: EllipseService) {
        super();
    }

    toggleTraceType(traceType: Mode): void {
        this.ellipseService.mode = traceType;
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
