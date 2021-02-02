import { Component } from '@angular/core';

@Component({
    selector: 'app-ellipse-config',
    templateUrl: './ellipse-config.component.html',
    styleUrls: ['./ellipse-config.component.scss'],
})
export class EllipseConfigComponent {
    sizeValue: number;

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
