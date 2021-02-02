import { Component } from '@angular/core';

@Component({
    selector: 'app-rectangle-config',
    templateUrl: './rectangle-config.component.html',
    styleUrls: ['./rectangle-config.component.scss'],
})
export class RectangleConfigComponent {
    sizeValue: number;

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
