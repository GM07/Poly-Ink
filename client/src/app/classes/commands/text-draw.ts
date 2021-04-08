import { TextConfig } from '@app/classes/tool-config/text-config';
import { ColorService } from 'src/color-picker/services/color.service';
import { AbstractDraw } from './abstract-draw';

export class TextDraw extends AbstractDraw {
    private config: TextConfig;
    private cursorX: number;
    private cursorY: number;

    constructor(colorService: ColorService, textConfig: TextConfig) {
        super(colorService);
        this.config = textConfig.clone();

        this.cursorX = 0;
        this.cursorY = 0;
    }

    execute(context: CanvasRenderingContext2D): void {
        this.applyAttributes(context);
    }

    private applyAttributes(ctx: CanvasRenderingContext2D): void {
        ctx.textBaseline = 'top';
        if(this.config.bold && this.config.italic) {
            ctx.font = 'bold italic ' + this.config.fontSize + 'px ' + this.config.textFont;
        } else if (this.config.italic) {
            ctx.font = 'italic ' + this.config.fontSize + 'px ' + this.config.textFont;
        } else if (this.config.bold) {
            ctx.font = 'bold ' + this.config.fontSize + 'px ' + this.config.textFont;
        } else {
            ctx.font = this.config.fontSize + 'px ' + this.config.textFont;
        }

        switch (this.config.alignmentSetting) {
            case 'left':
                ctx.textAlign = 'left';
                break;
            case 'center':
                ctx.textAlign = 'center';
                break;
            case 'right': 
                ctx.textAlign = 'right';
        }

        ctx.fillStyle = this.primaryRgba;
        ctx.strokeStyle = this.primaryRgba;
        this.drawText(ctx);
    }

    private drawText(ctx: CanvasRenderingContext2D): void {
        let y = this.config.startCoords.y;
        let linesAsString = this.config.textData.join('');
        let lines = linesAsString.split('Enter');
        for (let n = 0; n < lines.length; n++) {
            ctx.fillText(lines[n], this.config.startCoords.x, y);
            y += this.getfactorLineHeight() * this.config.fontSize;
        }
        if(this.config.hasInput) this.drawCursor(ctx, linesAsString);
    }

    public drawCursor(ctx: CanvasRenderingContext2D, text: string): void {
        let left = text.slice(0, this.config.index);
        let metrics = ctx.measureText(left);
        let width = metrics.width;
        this.cursorX= this.config.startCoords.x + width;
        this.cursorY = this.config.startCoords.y;
        let height = this.getfactorLineHeight() * this.config.fontSize;

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(this.cursorX, this.cursorY);
        ctx.lineTo(this.cursorX, this.cursorY + height);
        ctx.stroke();
        ctx.closePath();
    }

    private getfactorLineHeight(): number {
        switch(this.config.textFont) {
            case 'Arial':
                return 8/7;
            case 'Times New Roman':
                return 257/224;
            case 'Fantasy':
                return 175/112;
            case 'Monospace':
                return 8/7;
            case 'Cursive':
                return 11/7;
        }
        return 0;
    }
}
