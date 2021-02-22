import { Component } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { PolygoneMode, PolygoneService } from '@app/services/tools/polygone.service';

@Component({
    selector: 'app-polygone-config',
    templateUrl: './polygone-config.component.html',
    styleUrls: ['./polygone-config.component.scss'],
})
export class PolygoneConfigComponent extends ToolConfig {
    polygoneModeIn: typeof PolygoneMode = PolygoneMode;
    readonly MIN: number = ToolSettingsConst.MIN_WIDTH;
    readonly MAX: number = ToolSettingsConst.MAX_WIDTH;
    readonly MIN_NUM_EDGES: number = ToolSettingsConst.MIN_NUM_EDGES;
    readonly MAX_NUM_EDGES: number = ToolSettingsConst.MAX_NUM_EDGES;

    constructor(public polygoneService: PolygoneService) {
        super();
    }

    toggleTraceType(polygoneMode: PolygoneMode): void {
        this.polygoneService.polygoneMode = polygoneMode;
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
