import { Component, OnDestroy } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { Colors } from '@app/constants/colors';
import { Subscription } from 'rxjs';
import { Color } from '../../color';
import { ColorService } from '../../color.service';

@Component({
    selector: 'app-color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent implements OnDestroy, ToolConfig {
    selectedColor: Color;
    hexColor: string;
    private selectedColorSubscription: Subscription;

    selectedAlpha: number;
    private selectedAlphaSubscription: Subscription;

    constructor(private colorService: ColorService) {
        this.initValues();
        this.initSubscriptions();
    }

    initValues(): void {
        this.selectedColor = this.colorService.primaryColor;
        this.selectedAlpha = this.colorService.primaryColorAlpha;
        this.hexColor = this.selectedColor.hexString;
    }

    initSubscriptions(): void {
        this.selectedColorSubscription = this.colorService.selectedColorChangePalette.subscribe((value) => {
            this.selectedColor = value;
            this.hexColor = value.hexString;
        });

        this.selectedAlphaSubscription = this.colorService.primaryColorAlphaChange.subscribe((value) => {
            this.selectedAlpha = value;
        });
    }

    hexValueChange(hex: Color): void {
        this.colorService.selectedColorSliders = hex;
        this.colorService.selectedColorPalette = hex;
        this.colorService.selectedHueSliders = Color.hueToRgb(hex.hue);
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

        this.colorService.selectedColorSliders = color;
        this.colorService.selectedHueSliders = Color.hueToRgb(color.hue);
    }

    ngOnDestroy(): void {
        this.selectedColorSubscription.unsubscribe();
        this.selectedAlphaSubscription.unsubscribe();
    }

    valueChange(value: [string, number]): void {
        switch (value[0]) {
            case 'Alpha':
                this.selectedAlpha = value[1];
                break;
        }
    }

    chosePrimary(): void {
        this.colorService.primaryColor = this.selectedColor;
        this.colorService.primaryColorAlpha = this.selectedAlpha;
    }

    choseSecondary(): void {
        this.colorService.secondaryColor = this.selectedColor;
        this.colorService.secondaryColorAlpha = this.selectedAlpha;
    }
}
