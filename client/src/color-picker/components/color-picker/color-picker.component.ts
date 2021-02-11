import { Component } from '@angular/core';
import { Colors } from 'src/color-picker/constants/colors';
import { Color } from '../../classes/color';
import { ColorService } from '../../services/color.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
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
                color = Colors.WHITE.clone();
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
    }

    choseSecondary(): void {
        this.colorService.secondaryColor = this.colorService.selectedColor;
        this.colorService.secondaryColorAlpha = this.colorService.selectedAlpha;
    }
}
