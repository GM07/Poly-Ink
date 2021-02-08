import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { EraserService } from '@app/services/tools/eraser-service';

@Component({
    selector: 'app-eraser-config',
    templateUrl: './eraser-config.component.html',
    styleUrls: ['./eraser-config.component.scss'],
})
export class EraserConfigComponent extends ToolConfig {
    lineWidth: number;

    constructor(public eraserService: EraserService) {
        super();
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
