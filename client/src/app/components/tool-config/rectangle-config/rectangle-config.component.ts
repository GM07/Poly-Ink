import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-rectangle-config',
    templateUrl: './rectangle-config.component.html',
    styleUrls: ['./rectangle-config.component.scss'],
})
export class RectangleConfigComponent implements OnInit {
    constructor() {}

    sizeValue: number;

    colorSliderLabel(value: number): string {
        return value + 'px';
    }

    ngOnInit(): void {}
}
