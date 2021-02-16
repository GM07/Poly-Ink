import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Color } from 'src/color-picker/classes/color';
import { Colors } from 'src/color-picker/constants/colors';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    static readonly MAX_NUMBER_PREVIOUS_COLORS: number = 10;

    private primary: Color = Colors.BLACK;
    private secondary: Color = Colors.WHITE;

    private previous: Color[] = [];

    changePrimary: boolean = true;
    shouldChangeColor: boolean = true;

    selectedColor: Color = Colors.BLACK;
    selectedColorChangeFromHex: Subject<Color> = new Subject<Color>();

    selectedAlpha: number = 1;

    selectedHue: Color = Colors.BLACK;
    hueChangeFromHex: Subject<Color> = new Subject<Color>();
    hueChangeFromSlider: Subject<Color> = new Subject<Color>();

    primaryColorAlpha: number = 1;
    secondaryColorAlpha: number = 1;

    constructor() {
        this.previous.unshift(this.secondary);
        this.previous.unshift(this.primary);
    }

    get primaryRgba(): string {
        return this.rgba(this.primary, this.primaryColorAlpha);
    }
    get secondaryRgba(): string {
        return this.rgba(this.secondary, this.secondaryColorAlpha);
    }

    set primaryColor(color: Color) {
        this.primary = color.clone();
        this.addToPreviousColors(this.primary);
    }

    get primaryColor(): Color {
        return this.primary;
    }

    set secondaryColor(color: Color) {
        this.secondary = color.clone();
        this.addToPreviousColors(this.secondary);
    }

    get secondaryColor(): Color {
        return this.secondary;
    }

    set selectedHueFromSliders(hue: Color) {
        this.selectedHue = hue;
        this.hueChangeFromSlider.next(hue);
    }

    get previousColors(): Color[] {
        return this.previous;
    }

    set selectedColorFromHex(color: Color) {
        this.selectedColor = color;
        this.selectedHue = Color.hueToRgb(color.hue);
        this.selectedColorChangeFromHex.next(this.selectedColor);
        this.hueChangeFromHex.next(this.selectedHue);
    }

    rgba(color: Color, alpha: number): string {
        return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
    }

    addToPreviousColors(color: Color): void {
        this.removeDuplicateColor(color);

        this.previous.unshift(color);

        if (this.previous.length > ColorService.MAX_NUMBER_PREVIOUS_COLORS) {
            this.previous.pop();
        }
    }

    removeDuplicateColor(color: Color): void {
        for (const previousColor of this.previous) {
            if (color.equals(previousColor)) {
                const index = this.previous.indexOf(previousColor);
                this.previous.splice(index, 1);
                return;
            }
        }
    }

    swap(): void {
        const tmp: Color = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = tmp;

        const tmpAlpha: number = this.primaryColorAlpha;
        this.primaryColorAlpha = this.secondaryColorAlpha;
        this.secondaryColorAlpha = tmpAlpha;
    }

    choseColor(): void {
        if (!this.shouldChangeColor) return;

        if (this.changePrimary) {
            this.primaryColor = this.selectedColor;
            this.primaryColorAlpha = this.selectedAlpha;
        } else {
            this.secondaryColor = this.selectedColor;
            this.secondaryColorAlpha = this.selectedAlpha;
        }
    }
}
