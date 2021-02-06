import { Component } from '@angular/core';
// import { ToolConfig } from '@app/components/tool-config/tool-config';
import { ToolConfig } from '@app/classes/tool-config';
import { PencilService } from '@app/services/tools/pencil-service';

@Component({
    selector: 'app-eraser-config',
    templateUrl: './eraser-config.component.html',
    styleUrls: ['./eraser-config.component.scss'],
})
export class EraserConfigComponent extends ToolConfig {
    sizeValue: number;

    // TODO Changer pencilService pour eraserService
    constructor(public service: PencilService) {
        super();
        // this.traceTypeTestIn = 0;
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
