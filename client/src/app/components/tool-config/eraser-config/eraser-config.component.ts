import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { EraserService } from '@app/services/tools/eraser-service';
import { ToolSettingsConst } from '@app/constants/toolSettings';

@Component({
    selector: 'app-eraser-config',
    templateUrl: './eraser-config.component.html',
    styleUrls: ['./eraser-config.component.scss'],
})
export class EraserConfigComponent extends ToolConfig {
    lineWidth: number;
    readonly MIN = ToolSettingsConst.MIN_ERASER_WIDTH;
    readonly MAX = ToolSettingsConst.MAX_WIDTH;

    constructor(public eraserService: EraserService) {
        super();
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
