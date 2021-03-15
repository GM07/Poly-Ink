import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ShapeConfig, ShapeMode } from '@app/classes/tool-config/shape-config';
import { ColorService } from 'src/color-picker/services/color.service';
export class RectangleDraw extends AbstractDraw {
    config: ShapeConfig;

    constructor(colorService: ColorService, config: ShapeConfig) {
        super(colorService);
        this.config = config.clone();
    }

    // TODO - 1px border is not the right color
    execute(context: CanvasRenderingContext2D): void {
        let width: number = this.config.endCoords.x - this.config.startCoords.x;
        let height: number = this.config.endCoords.y - this.config.startCoords.y;
        if (this.config.shiftDown) {
            height = Math.sign(height) * Math.min(Math.abs(width), Math.abs(height));
            width = Math.sign(width) * Math.abs(height);
        }
        context.lineWidth = this.config.lineWidth;
        context.strokeStyle = this.secondaryRgba;
        context.fillStyle = this.primaryRgba;
        context.lineJoin = 'miter' as CanvasLineJoin;
        context.lineCap = 'square' as CanvasLineCap;
        context.beginPath();

        switch (this.config.shapeMode) {
            case ShapeMode.Contour:
                context.strokeRect(this.config.startCoords.x, this.config.startCoords.y, width, height);
                break;
            case ShapeMode.Filled:
                context.fillRect(this.config.startCoords.x, this.config.startCoords.y, width, height);
                break;
            case ShapeMode.FilledWithContour:
                context.rect(this.config.startCoords.x, this.config.startCoords.y, width, height);
                context.fill();
                break;
            default:
                break;
        }

        context.stroke();
        context.closePath();
    }
}
