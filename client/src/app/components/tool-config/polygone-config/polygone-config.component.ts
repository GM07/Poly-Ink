import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ToolConfig } from '@app/classes/tool-config';
import { ShapeMode } from '@app/classes/tool-config/shape-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { PolygoneService } from '@app/services/tools/polygone.service';

@Component({
    selector: 'app-polygone-config',
    templateUrl: './polygone-config.component.html',
    styleUrls: ['./polygone-config.component.scss'],
})
export class PolygoneConfigComponent extends ToolConfig {
    polygoneModeIn: typeof ShapeMode = ShapeMode;
    readonly MIN: number = ToolSettingsConst.MIN_WIDTH;
    readonly MAX: number = ToolSettingsConst.MAX_WIDTH;
    readonly MAX_WIDTH_POLYGONE: number = ToolSettingsConst.MAX_WIDTH;
    readonly MIN_NUM_EDGES: number = ToolSettingsConst.MIN_NUM_EDGES;
    readonly MAX_NUM_EDGES: number = ToolSettingsConst.MAX_NUM_EDGES;

    constructor(public polygonService: PolygoneService) {
        super();
    }

    toggleTraceType(polygonMode: ShapeMode): void {
        this.polygonService.config.shapeMode = polygonMode;
    }

    colorSliderLabel(value: number): string {
        return value + 'px';
    }

    changeNumEdges(event: MatSliderChange): void {
        this.polygonService.numEdges = event.value as number;
    }

    changeContourWidth(event: MatSliderChange): void {
        this.polygonService.contourWidth = event.value as number;
    }
}
