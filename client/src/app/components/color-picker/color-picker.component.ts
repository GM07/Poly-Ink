import { Component, OnDestroy } from '@angular/core';
import { ToolConfig } from '@app/classes/tool-config';
import { Subscription } from 'rxjs';
import { Color } from './color';
import { ColorService } from './color.service';

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
