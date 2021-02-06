import { Component } from '@angular/core';
//import { ToolConfig } from '@app/components/tool-config/tool-config';
import { ToolConfig } from '@app/classes/tool-config';
import { PencilService } from '@app/services/tools/pencil-service';

@Component({
    selector: 'app-rectangle-config',
    templateUrl: './rectangle-config.component.html',
    styleUrls: ['./rectangle-config.component.scss'],
})
export class RectangleConfigComponent extends ToolConfig {

    public traceType: string;

    //TODO changer pencilService pour rectangleService
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
