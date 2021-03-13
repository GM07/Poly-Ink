import { PencilConfig } from '@app/classes/tool-config/pencil-config';
import { ColorService } from 'src/color-picker/services/color.service';
import { AbstractDraw } from './abstract-draw';

export class EraserDraw extends AbstractDraw {
    eraserConfig: PencilConfig;

    constructor(colorService: ColorService, eraserConfig: PencilConfig) {
        super(colorService);
        this.eraserConfig = eraserConfig;
    }

    execute(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.fillStyle = 'white';
        context.strokeStyle = 'white';
        context.lineWidth = this.eraserConfig.lineWidth;
        context.lineCap = 'butt' as CanvasLineCap;
        context.lineJoin = 'bevel' as CanvasLineJoin;
        for (const paths of this.eraserConfig.pathData) {
            if (paths.length >= 1)
                context.fillRect(
                    paths[0].x - this.eraserConfig.lineWidth / 2,
                    paths[0].y - this.eraserConfig.lineWidth / 2,
                    this.eraserConfig.lineWidth,
                    this.eraserConfig.lineWidth,
                );
            for (const point of paths) {
                context.lineTo(point.x, point.y);
            }
            context.stroke();
            context.beginPath();
        }
        context.stroke();
    }
}
