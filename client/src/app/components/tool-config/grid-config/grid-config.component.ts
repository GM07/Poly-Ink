import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { ToolMath } from '@app/constants/math';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { GridService } from '@app/services/drawing/grid.service';

@Component({
    selector: 'app-grid-config',
    templateUrl: './grid-config.component.html',
    styleUrls: ['./grid-config.component.scss'],
})
export class GridConfigComponent {
    readonly MIN_SIZE: number = ToolSettingsConst.GRID_MIN_SIZE;
    readonly MAX_SIZE: number = ToolSettingsConst.GRID_MAX_SIZE;

    readonly MIN_TRANSPARENCY: number = (ToolSettingsConst.GRID_MIN_OPACITY) * ToolMath.PERCENTAGE;
    readonly MAX_TRANSPARENCY: number = (ToolSettingsConst.GRID_MAX_OPACITY) * ToolMath.PERCENTAGE;

    constructor(public gridService: GridService) {}

    colorSliderLabel(value: number): string {
        return value.toString();
    }

    sizeChange(event: MatSliderChange): void {
        this.gridService.sizeValue = event.value as number;
    }

    opacityChange(event: MatSliderChange): void {
        this.gridService.opacityValue = event.value as number;
    }
}
