import { Component, EventEmitter, Output } from '@angular/core';
import { Color } from 'src/color-picker/classes/color';
import { ColorService } from 'src/color-picker/services/color.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
    @Output()
    closeMenuEvent: EventEmitter<void> = new EventEmitter<void>();

    constructor(public colorService: ColorService) {}

    hexValueChange(hex: Color): void {
        this.colorService.selectedColorFromHex = hex;
    }

    hexRGBChange(values: [string, string]): void {
        const component: number = parseInt(values[1], 16);
        const r: number = this.colorService.selectedColor.r;
        const g: number = this.colorService.selectedColor.g;
        const b: number = this.colorService.selectedColor.b;
        let color: Color;
        switch (values[0]) {
            case 'R':
                color = new Color(component, g, b);
                break;

            case 'G':
                color = new Color(r, component, b);
                break;

            case 'B':
                color = new Color(r, g, component);
                break;

            default:
                color = this.colorService.selectedColor;
        }

        this.hexValueChange(color);
    }

    valueChange(value: [string, number]): void {
        switch (value[0]) {
            case 'Alpha':
                this.colorService.selectedAlpha = value[1];
                break;
        }
    }

    chosePrimary(): void {
        this.colorService.primaryColor = this.colorService.selectedColor;
        this.colorService.primaryColorAlpha = this.colorService.selectedAlpha;
        this.closeColorPicker();
    }

    choseSecondary(): void {
        this.colorService.secondaryColor = this.colorService.selectedColor;
        this.colorService.secondaryColorAlpha = this.colorService.selectedAlpha;
        this.closeColorPicker();
    }

    closeColorPicker(): void {
        this.closeMenuEvent.emit();
    }
}