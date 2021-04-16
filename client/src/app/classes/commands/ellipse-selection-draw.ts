import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { SelectionConfig } from '@app/classes/tool-config/selection-config';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';

export class EllipseSelectionDraw extends AbstractDraw {
    private config: SelectionConfig;

    static drawClippedSelection(ctx: CanvasRenderingContext2D, config: SelectionConfig): void {
        const radius = new Vec2(config.width / 2, config.height / 2).apply(Math.abs);
        const center = radius.add(config.endCoords);

        ctx.beginPath();
        ctx.save();
        ctx.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(config.SELECTION_DATA, config.endCoords.x, config.endCoords.y, Math.abs(config.width), Math.abs(config.height));
        ctx.restore();
        ctx.closePath();
    }

    constructor(colorService: ColorService, config: SelectionConfig) {
        super(colorService);
        this.config = config.clone();
    }

    execute(context: CanvasRenderingContext2D): void {
        if (!this.config.markedForPaste) {
            this.fillBackground(context);
        }

        if (!this.config.markedForDelete) {
            EllipseSelectionDraw.drawClippedSelection(context, this.config);
        }
    }

    private fillBackground(context: CanvasRenderingContext2D): void {
        if (!this.config.didChange()) return;

        const radius = new Vec2(this.config.originalWidth / 2, this.config.originalHeight / 2).apply(Math.abs);
        const center = this.config.startCoords.add(radius);
        context.beginPath();
        context.fillStyle = 'white';
        context.ellipse(center.x, center.y, radius.x, radius.y, 0, 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    }
}
