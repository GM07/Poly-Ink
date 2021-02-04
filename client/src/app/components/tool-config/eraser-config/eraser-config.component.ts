import { Component } from '@angular/core';

@Component({
    selector: 'app-eraser-config',
    templateUrl: './eraser-config.component.html',
    styleUrls: ['./eraser-config.component.scss'],
})
export class EraserConfigComponent {
    sizeValue: number;

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
