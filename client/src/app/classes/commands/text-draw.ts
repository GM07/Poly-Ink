import { TextConfig } from '@app/classes/tool-config/text-config';
import { ColorService } from 'src/color-picker/services/color.service';
import { AbstractDraw } from './abstract-draw';

export class TextDraw extends AbstractDraw {
    private config: TextConfig;
    private cursorX: number;
    private cursorY: number;
    currentLineIndex: number;

    constructor(colorService: ColorService, textConfig: TextConfig) {
        super(colorService);
        this.config = textConfig.clone();

        this.cursorX = 0;
        this.cursorY = 0;
        this.currentLineIndex = 0;
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
        this.config.textData.forEach((line, index) => {
            ctx.fillText(line, this.config.startCoords.x, y);
            if(this.config.hasInput && index === this.config.index.y) {
                this.drawCursor(ctx, line, y);
            }
            y += this.getfactorLineHeight() * this.config.fontSize;
        });
    }

    /*public findIndex(): void {
        for(let i = 0; i < this.config.lineIndexes.length; i++) {
            if(this.config.index >= this.config.lineIndexes[i]) {
                this.currentLineIndex = this.config.index - this.config.lineIndexes[i];
                return;
            }
        }
        this.currentLineIndex = this.config.index;
    }*/

    public drawCursor(ctx: CanvasRenderingContext2D, text: string, y: number): void {
        let left = text.slice(0, this.config.index.x);
        let metrics = ctx.measureText(left);
        let width = metrics.width;
        this.cursorX= this.config.startCoords.x + width;
        this.cursorY = y;
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
