import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Colors } from 'src/color-picker/constants/colors';
import { Color } from '../classes/color';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    static readonly MAX_NUMBER_PREVIOUS_COLORS: number = 10;

    private primary: Color = Colors.BLACK;
    private secondary: Color = Colors.WHITE;

    private previous: Color[] = [];

    private selected: Color = Colors.BLACK;
    selectedColorChangeFromHex: Subject<Color> = new Subject<Color>();

    public selectedAlpha: number = 1;

    private hue: Color = Colors.BLACK;
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

    set selectedColor(color: Color) {
        this.selected = color;
    }

    get selectedColor(): Color {
        return this.selected;
    }

    set selectedHue(color: Color) {
        this.hue = color;
    }

    get selectedHue(): Color {
        return this.hue;
    }

    set selectedHueFromSliders(hue: Color) {
        this.hue = hue;
        this.hueChangeFromSlider.next(hue);
    }

    get previousColors(): Color[] {
        return this.previous;
    }

    set selectedColorFromHex(color: Color) {
        this.selected = color;
        this.hue = Color.hueToRgb(color.hue);
        this.selectedColorChangeFromHex.next(this.selected);
        this.hueChangeFromHex.next(this.hue);
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
}
