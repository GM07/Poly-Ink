import { ColorService } from 'src/color-picker/services/color.service';

export abstract class AbstractDraw {
    protected primaryRgba: string;
    protected secondaryRgba: string;

    constructor(protected colorService: ColorService) {
        this.primaryRgba = colorService.primaryRgba;
        this.secondaryRgba = colorService.secondaryRgba;
    }

    abstract execute(context: CanvasRenderingContext2D): void;
}
