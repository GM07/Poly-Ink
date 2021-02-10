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
    primaryColorChange: Subject<Color> = new Subject<Color>();

    private secondary: Color = Colors.WHITE;
    secondaryColorChange: Subject<Color> = new Subject<Color>();

    private previous: Color[] = [];
    previousColorsChange: Subject<Color[]> = new Subject<Color[]>();

    private selected: Color = Colors.BLACK;
    selectedColorChange: Subject<Color> = new Subject<Color>();
    selectedColorChangePalette: Subject<Color> = new Subject<Color>();
    selectedColorChangeSliders: Subject<Color> = new Subject<Color>();

    private hue: Color = Colors.BLACK;
    selectedHueChange: Subject<Color> = new Subject<Color>();
    selectedHueChangeSliders: Subject<Color> = new Subject<Color>();
    selectedHueChangeWheel: Subject<Color> = new Subject<Color>();

    private primaryAlpha: number = 1;
    primaryColorAlphaChange: Subject<number> = new Subject<number>();
    secondaryColorAlpha: number = 1;

    constructor() {
        this.previous.unshift(this.secondary);
        this.previous.unshift(this.primary);
    }

    get primaryRgba(): string {
        return this.primary.toRgbaString(this.primaryColorAlpha);
    }
    get secondaryRgba(): string {
        return this.secondary.toRgbaString(this.secondaryColorAlpha);
    }

    set primaryColor(color: Color) {
        this.primary = color.clone();
        this.addToPreviousColors(this.primary);
        this.primaryColorChange.next(this.primary);
    }

    get primaryColor(): Color {
        return this.primary;
    }

    set secondaryColor(color: Color) {
        this.secondary = color.clone();
        this.addToPreviousColors(this.secondary);
        this.secondaryColorChange.next(this.secondary);
    }

    get secondaryColor(): Color {
        return this.secondary;
    }

    set selectedColor(color: Color) {
        this.selected = color;
        this.selectedColorChange.next(this.selected);
    }

    get selectedColor(): Color {
        return this.selected;
    }

    set selectedColorPalette(color: Color) {
        this.selectedColor = color;
        this.selectedColorChangePalette.next(color);
    }

    set selectedColorSliders(color: Color) {
        this.selectedColor = color;
        this.selectedColorChangeSliders.next(color);
    }

    set selectedHue(color: Color) {
        this.hue = color;
        this.selectedHueChange.next(this.hue);
    }

    get selectedHue(): Color {
        return this.hue;
    }

    set selectedHueSliders(color: Color) {
        this.selectedHue = color;
        this.selectedHueChangeSliders.next(color);
    }

    set selectedHueWheel(color: Color) {
        this.selectedHue = color;
        this.selectedHueChangeWheel.next(color);
    }

    set primaryColorAlpha(alpha: number) {
        this.primaryAlpha = alpha;
        this.primaryColorAlphaChange.next(this.primaryAlpha);
    }

    get primaryColorAlpha(): number {
        return this.primaryAlpha;
    }

    get previousColors(): Color[] {
        return this.previous;
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

        this.previousColorsChange.next(this.previous);
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
