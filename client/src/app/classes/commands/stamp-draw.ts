import { ColorService } from 'src/color-picker/services/color.service';
import { StampConfig } from '../tool-config/stamp-config';
import { AbstractDraw } from './abstract-draw';

export class StampDraw extends AbstractDraw {
    private config: StampConfig;

    constructor(colorService: ColorService, stampConfig: StampConfig) {
        super(colorService);
        this.config = stampConfig.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        context.translate(this.config.position.x, this.config.position.y);
        context.rotate(this.config.angle);
        context.drawImage(this.config.etampeImg, (-50 * this.config.scale) / 2, (-50 * this.config.scale) / 2, 50 * this.config.scale, 50 * this.config.scale);
        context.rotate(-this.config.angle);
        context.translate(-this.config.position.x, -this.config.position.y);
    }
}
