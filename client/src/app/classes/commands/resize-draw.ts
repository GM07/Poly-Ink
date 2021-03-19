import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ResizeConfig } from '@app/classes/tool-config/resize-config';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
export class ResizeDraw extends AbstractDraw {
    private config: ResizeConfig;
    drawingService: DrawingService;

    constructor(config: ResizeConfig, drawingService: DrawingService) {
        super({ primaryRgba: '', secondaryRgba: '' } as ColorService);

        this.config = config;
        this.drawingService = drawingService;
    }

    execute(context: CanvasRenderingContext2D): void {
        this.drawingService.resizeCanvas(this.config.width, this.config.height);
    }
}
