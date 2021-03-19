import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { LineService } from '@app/services/tools/line.service';
@Component({
    selector: 'app-line-config',
    templateUrl: './line-config.component.html',
    styleUrls: ['./line-config.component.scss'],
})
export class LineConfigComponent extends ToolConfig {
    readonly MIN: number = ToolSettingsConst.MIN_WIDTH;
    readonly MAX: number = ToolSettingsConst.MAX_WIDTH;

    constructor(public lineService: LineService) {
        super();
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }

    toggleLineType(lineType: boolean): void {
        this.lineService.config.showJunctionPoints = lineType;
    }
}
