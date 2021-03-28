import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ShapeConfig, ShapeMode } from '@app/classes/tool-config/shape-config';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from 'src/color-picker/services/color.service';
export class RectangleDraw extends AbstractDraw {
    private config: ShapeConfig;

    constructor(colorService: ColorService, config: ShapeConfig) {
        super(colorService);
        this.config = config.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        const size: Vec2 = this.config.endCoords.substract(this.config.startCoords);
        if (this.config.shiftDown) {
            size.y = Math.sign(size.y) * Math.min(Math.abs(size.x), Math.abs(size.y));
            size.x = Math.sign(size.x) * Math.abs(size.y);
        }
        context.lineWidth = this.config.lineWidth;
        context.strokeStyle = this.secondaryRgba;
        context.fillStyle = this.primaryRgba;
        context.lineJoin = 'miter' as CanvasLineJoin;
        context.lineCap = 'square' as CanvasLineCap;
        context.beginPath();

        switch (this.config.shapeMode) {
            case ShapeMode.Contour:
                context.strokeRect(this.config.startCoords.x, this.config.startCoords.y, size.x, size.y);
                break;
            case ShapeMode.Filled:
                context.fillRect(this.config.startCoords.x, this.config.startCoords.y, size.x, size.y);
                break;
            case ShapeMode.FilledWithContour:
                context.rect(this.config.startCoords.x, this.config.startCoords.y, size.x, size.y);
                context.fill();
                break;
        }

        context.stroke();
        context.closePath();
    }
}
