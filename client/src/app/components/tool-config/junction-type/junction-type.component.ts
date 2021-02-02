import { Component } from '@angular/core';

// TODO quand ligne sera faite!
export interface IJunctionTypeComponent {
    avecPoint: boolean;
}

@Component({
    selector: 'app-junction-type',
    templateUrl: './junction-type.component.html',
    styleUrls: ['./junction-type.component.scss'],
})
export class JunctionTypeComponent implements IJunctionTypeComponent {
    avecPoint: boolean;

    toggleTypeLigne(typeLigne: string): void {
        typeLigne === 'normal' ? (this.avecPoint = false) : (this.avecPoint = true);
    }
}
