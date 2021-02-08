import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { EllipseMode, EllipseService } from '@app/services/tools/ellipse-service';

@Component({
    selector: 'app-ellipse-config',
    templateUrl: './ellipse-config.component.html',
    styleUrls: ['./ellipse-config.component.scss'],
})
export class EllipseConfigComponent extends ToolConfig {
    ellipseModeIn: typeof EllipseMode = EllipseMode;
    traceTypeIn: EllipseMode;

    constructor(public ellipseService: EllipseService) {
        super();
        this.traceTypeIn = EllipseMode.Contour;
    }

    toggleTraceType(traceType: EllipseMode): void {
        this.traceTypeIn = traceType;
        this.ellipseService.ellipseMode = traceType;
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
