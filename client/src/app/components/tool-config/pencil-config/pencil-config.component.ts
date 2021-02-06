import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { PencilService } from '@app/services/tools/pencil-service';

@Component({
    selector: 'app-pencil-config',
    templateUrl: './pencil-config.component.html',
    styleUrls: ['./pencil-config.component.scss'],
})
export class PencilConfigComponent extends ToolConfig {
    lineWidth: number;

    constructor(public pencilService: PencilService) {
        super();
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
