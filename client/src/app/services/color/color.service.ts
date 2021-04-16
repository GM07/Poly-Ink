import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { Colors } from '@app/constants/colors';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    private static readonly MAX_NUMBER_PREVIOUS_COLORS: number = 10;

    private primary: Color;
    private secondary: Color;

    private previous: Color[] = [];

    changePrimary: boolean;
    shouldChangeColor: boolean;
    isMenuOpen: boolean;

    selectedColor: Color;
    selectedColorChangeFromHex: Subject<Color>;

    selectedAlpha: number = 1;

    selectedHue: Color;
    hueChangeFromHex: Subject<Color>;
    hueChangeFromSlider: Subject<Color>;

    primaryColorAlpha: number = 1;
    secondaryColorAlpha: number = 1;

    constructor() {
        this.primary = Colors.BLACK;
        this.secondary = Colors.WHITE;
        this.changePrimary = true;
        this.shouldChangeColor = true;
        this.isMenuOpen = false;
        this.selectedColor = Colors.BLACK;
        this.selectedColorChangeFromHex = new Subject<Color>();
        this.selectedAlpha = 1;
        this.selectedHue = Colors.BLACK;
        this.hueChangeFromHex = new Subject<Color>();
        this.hueChangeFromSlider = new Subject<Color>();

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
