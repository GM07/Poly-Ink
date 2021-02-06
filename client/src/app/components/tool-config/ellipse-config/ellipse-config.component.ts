import { Component } from '@angular/core';
//import { ToolConfig } from '@app/components/tool-config/tool-config';
import { ToolConfig } from '@app/classes/tool-config';
import { PencilService } from '@app/services/tools/pencil-service';

@Component({
    selector: 'app-ellipse-config',
    templateUrl: './ellipse-config.component.html',
    styleUrls: ['./ellipse-config.component.scss'],
})
export class EllipseConfigComponent extends ToolConfig {

    public traceType: string;

    //TODO Changer pencilService pour ellipseService
    constructor(public service: PencilService) {
        super();
        this.traceType = 'Contour';
    }

    public toggleTraceType(traceType: string): void {
        this.traceType = traceType; 
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
