import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ResizeConfig } from '@app/classes/tool-config/resize-config';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
export class ResizeDraw extends AbstractDraw {
    private config: ResizeConfig;

    constructor(config: ResizeConfig, private drawingService: DrawingService) {
        super({ primaryRgba: '', secondaryRgba: '' } as ColorService);

        this.config = config;
    }

    execute(): void {
        this.drawingService.resizeCanvas(this.config.width, this.config.height);
    }
}
