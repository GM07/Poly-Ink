import { Component, Input, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { ColorService } from 'src/color-picker/services/color.service';

@Component({
    selector: 'app-color-icon',
    templateUrl: './color-icon.component.html',
    styleUrls: ['./color-icon.component.scss'],
})
export class ColorIconComponent {
    @Input()
    width: number;

    @Input()
    height: number;

    @ViewChild(MatMenuTrigger) colorMenuTrigger: MatMenuTrigger;

    swapIconSize: number;

    constructor(public colorService: ColorService) {}

    swap(): void {
        this.colorService.swap();
    }

    openColorPicker(): void {
        this.colorService.selectedColorFromHex = this.colorService.primaryColor;
        this.colorService.selectedAlpha = this.colorService.primaryColorAlpha;
        this.colorMenuTrigger.openMenu();
    }

    closeMenu(): void {
        this.colorMenuTrigger.closeMenu();
    }
}
