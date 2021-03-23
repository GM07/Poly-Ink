import { Component, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { GridService } from '@app/services/drawing/grid.service';

@Component({
    selector: 'app-grid-config',
    templateUrl: './grid-config.component.html',
    styleUrls: ['./grid-config.component.scss'],
})
export class GridConfigComponent implements OnInit {
    readonly MIN_SIZE: number = 25;
    readonly MAX_SIZE: number = 75;

    readonly MIN_OPACITY: number = 0.4;
    readonly MAX_OPACITY: number = 1;

    constructor(public gridService: GridService) {}

    ngOnInit(): void {
        //
    }

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
