import { LassoConfig } from '@app/classes/tool-config/lasso-config';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ColorService } from 'src/color-picker/services/color.service';
import { AbstractDraw } from './abstract-draw';

export class LassoDraw extends AbstractDraw {
    private config: LassoConfig;
    constructor(colorService: ColorService, config: LassoConfig) {
        super(colorService);
        this.config = config.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        if (!this.config.inSelection) {
            context.setLineDash([5, 15]);
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(this.config.points[0].x, this.config.points[0].y);
            for (let index = 1; index < this.config.points.length; index++) {
                const point = this.config.points[index];
                context.lineTo(point.x, point.y);
            }
            context.stroke();
            context.closePath();
            return;
        }

        const selectionCanvas = this.saveSelectionToCanvas(context);
        this.fillBackground(context);

        context.beginPath();
        context.save();

        const dp = this.config.endCoords.substract(this.config.startCoords);
        console.log(dp);
        context.beginPath();
        context.moveTo(this.config.points[0].x + dp.x, this.config.points[0].y + dp.y);
        for (let index = 1; index < this.config.points.length; index++) {
            const point = this.config.points[index];
            context.lineTo(point.x + dp.x, point.y + dp.y);
        }
        context.clip();

        context.drawImage(selectionCanvas, this.config.endCoords.x, this.config.endCoords.y);
        context.restore();
    }

    private fillBackground(context: CanvasRenderingContext2D): void {
        context.fillStyle = 'white';
        context.beginPath();
        context.moveTo(this.config.points[0].x, this.config.points[0].y);
        for (let index = 1; index < this.config.points.length; index++) {
            const point = this.config.points[index];
            context.lineTo(point.x, point.y);
        }
        context.fill();
        context.closePath();
    }

    private saveSelectionToCanvas(context: CanvasRenderingContext2D): HTMLCanvasElement {
        const imageData = context.getImageData(
            this.config.startCoords.x,
            this.config.startCoords.y,
            Math.abs(this.config.originalWidth),
            Math.abs(this.config.originalHeight),
        );

        const returnedCanvas = document.createElement('canvas');
        const returnedCtx = returnedCanvas.getContext('2d') as CanvasRenderingContext2D;

        returnedCanvas.width = Math.abs(this.config.originalWidth);
        returnedCanvas.height = Math.abs(this.config.originalHeight);
        returnedCtx.putImageData(imageData, 0, 0);

        const memoryCanvas = document.createElement('canvas');
        DrawingService.saveCanvas(memoryCanvas, returnedCanvas);
        returnedCanvas.width = Math.abs(this.config.width);
        returnedCanvas.height = Math.abs(this.config.height);
        returnedCtx.save();
        returnedCtx.scale(this.config.scaleFactor.x, this.config.scaleFactor.y);
        returnedCtx.drawImage(
            memoryCanvas,
            this.config.scaleFactor.x < 0 ? -Math.abs(this.config.width) : 0,
            this.config.scaleFactor.y < 0 ? -Math.abs(this.config.height) : 0,
            Math.abs(this.config.width),
            Math.abs(this.config.height),
        );
        returnedCtx.restore();

        return returnedCanvas;
    }
}
