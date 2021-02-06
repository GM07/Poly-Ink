import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { PencilService } from '@app/services/tools/pencil-service';

@Component({
    selector: 'app-ellipse-config',
    templateUrl: './ellipse-config.component.html',
    styleUrls: ['./ellipse-config.component.scss'],
})
export class EllipseConfigComponent extends ToolConfig {
    traceType: string;
    traceTypeTestIn: number;

    // TODO Changer pencilService pour ellipseService
    constructor(public service: PencilService) {
        super();
        this.traceType = 'Contour';
        // this.traceTypeTestIn = 0;
    }

    /*TODO implementer cette fonction quand ellipse sera integre
    traceTypeTest(ellipseMode: number) {
        this.traceTypeTestIn = ellipseMode;
        this.ellipseService.ellipseMode = this.traceTypeTestIn;
    }*/

    toggleTraceType(traceType: string): void {
        this.traceType = traceType;
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
