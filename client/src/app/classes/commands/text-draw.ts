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
            y += this.config.fontSize;
        });
        if(this.config.hasInput) {
            this.drawCursor(ctx);
        }
    }

    private drawCursor(ctx: CanvasRenderingContext2D): void {
        switch (this.config.alignmentSetting) {
            case 'left':
                this.drawCursorLeft(ctx);
                break;
            case 'right':
                this.drawCursorRight(ctx);
                break;
            case 'center':
                this.drawCursorCenter(ctx);
                break;
            default:
                break;
        }
    }

    private drawCursorLeft(ctx: CanvasRenderingContext2D): void {
        let y = this.config.startCoords.y + this.config.fontSize * this.config.index.y;
        let left = this.config.textData[this.config.index.y].slice(0, this.config.index.x);
        let metrics = ctx.measureText(left);
        let width = metrics.width;
        this.cursorX= this.config.startCoords.x + width;
        this.cursorY = y;
        let height = this.config.fontSize;

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(this.cursorX, this.cursorY);
        ctx.lineTo(this.cursorX, this.cursorY + height);
        ctx.stroke();
        ctx.closePath();
    }

    private drawCursorRight(ctx: CanvasRenderingContext2D): void {
        let y = this.config.startCoords.y + this.config.fontSize * this.config.index.y;
        let right = this.config.textData[this.config.index.y].slice(this.config.index.x);
        let metrics = ctx.measureText(right);
        let width = metrics.width;
        this.cursorX= this.config.startCoords.x - width;
        this.cursorY = y;
        let height = this.config.fontSize;

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(this.cursorX, this.cursorY);
        ctx.lineTo(this.cursorX, this.cursorY + height);
        ctx.stroke();
        ctx.closePath();
    }

    private drawCursorCenter(ctx: CanvasRenderingContext2D): void {
        let y = this.config.startCoords.y + this.config.fontSize * this.config.index.y;
        let newStartCoords = this.config.startCoords.clone();
        let text = this.config.textData[this.config.index.y]
        let metricsText = ctx.measureText(text);
        newStartCoords.x -= metricsText.width/2;

        let left = this.config.textData[this.config.index.y].slice(0, this.config.index.x);
        let metricsLeft = ctx.measureText(left);
        this.cursorX= newStartCoords.x + metricsLeft.width;
        this.cursorY = y;
        
        let height = this.config.fontSize;

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(this.cursorX, this.cursorY);
        ctx.lineTo(this.cursorX, this.cursorY + height);
        ctx.stroke();
        ctx.closePath();
    }
}
