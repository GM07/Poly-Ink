import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-eraser-config',
    templateUrl: './eraser-config.component.html',
    styleUrls: ['./eraser-config.component.scss'],
})
export class EraserConfigComponent implements OnInit {
    sizeValue: number;

    colorSliderLabel(value: number): string {
        return value + 'px';
    }

    constructor() {}

    ngOnInit(): void {}
}
