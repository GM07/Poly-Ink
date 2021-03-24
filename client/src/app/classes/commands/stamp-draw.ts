import { StampConfig } from '@app/classes/tool-config/stamp-config';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { ColorService } from 'src/color-picker/services/color.service';
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
        context.drawImage(
            this.config.etampeImg,
            (-ToolSettingsConst.STAMP_DEFAULT_SIZE * this.config.scale) / 2,
            (-ToolSettingsConst.STAMP_DEFAULT_SIZE * this.config.scale) / 2,
            ToolSettingsConst.STAMP_DEFAULT_SIZE * this.config.scale,
            ToolSettingsConst.STAMP_DEFAULT_SIZE * this.config.scale,
        );
        context.rotate(-this.config.angle);
        context.translate(-this.config.position.x, -this.config.position.y);
    }
}
