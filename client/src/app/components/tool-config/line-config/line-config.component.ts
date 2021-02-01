import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-line-config',
    templateUrl: './line-config.component.html',
    styleUrls: ['./line-config.component.scss'],
})
export class LineConfigComponent implements OnInit {
    constructor() {}

    epaisseurLigne: number;
    epaisseurTrait: number;
    avecPoint: boolean = false;

    colorSliderLabel(value: number): string {
        return value + 'px';
    }

    toggleTypeLigne(typeLigne: string): void {
        typeLigne === 'normal' ? (this.avecPoint = false) : (this.avecPoint = true);
    }

    ngOnInit(): void {}
}
