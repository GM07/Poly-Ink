import { PencilConfig } from '@app/classes/tool-config/pencil-config';
import { ColorService } from '@app/services/color/color.service';
import { AbstractDraw } from './abstract-draw';

export class EraserDraw extends AbstractDraw {
    private config: PencilConfig;

    constructor(colorService: ColorService, eraserConfig: PencilConfig) {
        super(colorService);
        this.config = eraserConfig.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        context.beginPath();
        context.fillStyle = 'white';
        context.strokeStyle = 'white';
        context.lineWidth = this.config.lineWidth;
        context.lineCap = 'butt' as CanvasLineCap;
        context.lineJoin = 'bevel' as CanvasLineJoin;
        for (const paths of this.config.pathData) {
            if (paths.length >= 1)
                context.fillRect(
                    paths[0].x - this.config.lineWidth / 2,
                    paths[0].y - this.config.lineWidth / 2,
                    this.config.lineWidth,
                    this.config.lineWidth,
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
