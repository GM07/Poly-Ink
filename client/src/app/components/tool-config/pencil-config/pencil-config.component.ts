import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ToolConfig } from '@app/classes/tool-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { PencilService } from '@app/services/tools/pencil.service';
@Component({
    selector: 'app-pencil-config',
    templateUrl: './pencil-config.component.html',
    styleUrls: ['./pencil-config.component.scss'],
})
export class PencilConfigComponent extends ToolConfig {
    readonly MIN: number = ToolSettingsConst.MIN_WIDTH;
    readonly MAX: number = ToolSettingsConst.MAX_WIDTH;

    constructor(public pencilService: PencilService) {
        super();
    }

    widthChange(event: MatSliderChange): void {
        this.pencilService.config.lineWidth = event.value as number;
    }
}
