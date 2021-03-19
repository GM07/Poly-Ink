import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { AerosolConfig } from '@app/classes/tool-config/aerosol-config';
import { ColorService } from 'src/color-picker/services/color.service';
export class AerosolDraw extends AbstractDraw {
    private config: AerosolConfig;

    constructor(colorService: ColorService, config: AerosolConfig) {
        super(colorService);
        this.config = config.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.fillStyle = this.colorService.primaryRgba;
        context.strokeStyle = this.colorService.primaryRgba;
        context.lineWidth = this.config.areaDiameter;
        context.lineCap = 'round' as CanvasLineCap;
        context.lineJoin = 'round' as CanvasLineJoin;

        this.config.droplets.forEach((points) => {
            points.forEach((point) => {
                context.arc(point.x, point.y, this.config.dropletDiameter / 2, 0, 2 * Math.PI);
                context.fill();
                context.beginPath();
                context.stroke();
            });
        });
    }
}
