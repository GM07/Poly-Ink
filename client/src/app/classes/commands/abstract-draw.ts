import { ColorService } from 'src/color-picker/services/color.service';

export abstract class AbstractDraw {
    primaryRgba: string;
    secondaryRgba: string;

    constructor(protected colorService: ColorService) {
        this.primaryRgba = colorService.primaryRgba;
        this.secondaryRgba = colorService.secondaryRgba;
    }

    abstract execute(context: CanvasRenderingContext2D): void;
}
