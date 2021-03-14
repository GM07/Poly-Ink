import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { EllipseMode } from '@app/classes/tool-config/ellipse-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { EllipseService } from '@app/services/tools/ellipse.service';
@Component({
    selector: 'app-ellipse-config',
    templateUrl: './ellipse-config.component.html',
    styleUrls: ['./ellipse-config.component.scss'],
})
export class EllipseConfigComponent extends ToolConfig {
    ellipseModeIn: typeof EllipseMode = EllipseMode;
    readonly MIN: number = ToolSettingsConst.MIN_WIDTH;
    readonly MAX: number = ToolSettingsConst.MAX_WIDTH;

    constructor(public ellipseService: EllipseService) {
        super();
    }

    toggleTraceType(traceType: EllipseMode): void {
        this.ellipseService.config.ellipseMode = traceType;
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
