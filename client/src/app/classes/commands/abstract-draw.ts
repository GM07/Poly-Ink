import { Color } from 'src/color-picker/classes/color';
import { ColorService } from 'src/color-picker/services/color.service';

export abstract class AbstractDraw {
    protected primary: Color;
    protected secondary: Color;
    protected primaryAlpha: number;
    protected secondaryAlpha: number;

    constructor(protected colorService: ColorService) {
        this.primary = colorService.primaryColor;
        this.primaryAlpha = colorService.primaryColorAlpha;
        this.secondary = colorService.secondaryColor;
        this.secondaryAlpha = colorService.secondaryColorAlpha;
    }

    get primaryRgba(): string {
        return this.primary.toRgbaString(this.primaryAlpha);
    }

    get secondaryRgba(): string {
        return this.secondary.toRgbaString(this.secondaryAlpha);
    }

    abstract execute(context: CanvasRenderingContext2D): void;
}
