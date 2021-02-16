import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { EraserService } from '@app/services/tools/eraser.service';

@Component({
    selector: 'app-eraser-config',
    templateUrl: './eraser-config.component.html',
    styleUrls: ['./eraser-config.component.scss'],
})
export class EraserConfigComponent extends ToolConfig {
    readonly MIN: number = ToolSettingsConst.MIN_ERASER_WIDTH;
    readonly MAX: number = ToolSettingsConst.MAX_WIDTH;

    constructor(public eraserService: EraserService) {
        super();
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
