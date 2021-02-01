import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-crayon-config',
    templateUrl: './crayon-config.component.html',
    styleUrls: ['./crayon-config.component.scss'],
})
export class CrayonConfigComponent implements OnInit {
    sizeValue: number;

    colorSliderLabel(value: number): string {
        return value + 'px';
    }

    constructor() {}

    ngOnInit(): void {}
}
