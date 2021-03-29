import { Component } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { GridService } from '@app/services/drawing/grid.service';

@Component({
    selector: 'app-grid-config',
    templateUrl: './grid-config.component.html',
    styleUrls: ['./grid-config.component.scss'],
})
export class GridConfigComponent {
    readonly MIN_SIZE: number = 25;
    readonly MAX_SIZE: number = 75;

    readonly MIN_TRANSPARENCY: number = 0;
    readonly MAX_TRANSPARENCY: number = 60;

    constructor(public gridService: GridService) {}

    colorSliderLabel(value: number): string {
        return value + '';
    }

    sizeChange(event: MatSliderChange): void {
        this.gridService.sizeValue = event.value as number;
    }

    opacityChange(event: MatSliderChange): void {
        this.gridService.opacityValue = event.value as number;
    }
}
