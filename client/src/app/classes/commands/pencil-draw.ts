import { Geometry } from '@app/classes/math/geometry';
import { PencilConfig } from '@app/classes/tool-config/pencil-config';
import { ColorService } from 'src/color-picker/services/color.service';
import { AbstractDraw } from './abstract-draw';

export class PencilDraw extends AbstractDraw {
    private config: PencilConfig;

    constructor(colorService: ColorService, pencilConfig: PencilConfig) {
        super(colorService);
        this.config = pencilConfig.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.strokeStyle = this.primaryRgba;
        context.fillStyle = this.primaryRgba;
        context.lineWidth = this.config.lineWidth;
        context.lineCap = 'round' as CanvasLineCap;
        context.lineJoin = 'round' as CanvasLineJoin;

        for (const paths of this.config.pathData) {
            // Special case to draw just one dot (or else it's not drawn)
            if (Geometry.isAPoint(paths)) {
                context.arc(paths[0].x, paths[0].y, this.config.lineWidth / 2, 0, Math.PI * 2);
                context.fill();
                context.beginPath();
            } else {
                for (const point of paths) {
                    context.lineTo(point.x, point.y);
                }
                context.stroke();
                context.beginPath();
            }
        }
        context.stroke();
    }
}
