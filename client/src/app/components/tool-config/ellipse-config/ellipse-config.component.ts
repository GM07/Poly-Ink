import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-ellipse-config',
    templateUrl: './ellipse-config.component.html',
    styleUrls: ['./ellipse-config.component.scss'],
})
export class EllipseConfigComponent implements OnInit {
    sizeValue: number;

    colorSliderLabel(value: number): string {
        return value + 'px';
    }

    constructor() {}

    ngOnInit(): void {}
}
