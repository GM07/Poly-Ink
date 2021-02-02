import { Component } from '@angular/core';

@Component({
    selector: 'app-diameter-junction-point',
    templateUrl: './diameter-junction-point.component.html',
    styleUrls: ['./diameter-junction-point.component.scss'],
})
export class DiameterJunctionPointComponent {
    diameterJunctionPoints: number;

    colorSliderLabel(value: number): string {
        return value + 'px';
    }
}
