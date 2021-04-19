import { TextAlignment, TextConfig } from '@app/classes/tool-config/text-config';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { AbstractDraw } from './abstract-draw';

export class TextDraw extends AbstractDraw {
    config: TextConfig;
    cursor: Vec2;
    currentLineIndex: number;
    textConfig: TextConfig;

    constructor(colorService: ColorService, textConfig: TextConfig) {
        super(colorService);
        this.config = textConfig.clone();
        this.textConfig = textConfig;

        this.cursor = new Vec2(0, 0);
        this.currentLineIndex = 0;
    }

    execute(context: CanvasRenderingContext2D): void {
        this.applyAttributes(context);
    }

    private applyAttributes(ctx: CanvasRenderingContext2D): void {
        ctx.textBaseline = 'top';

        const bold: string = this.config.bold ? 'bold ' : '';
        const italic: string = this.config.italic ? 'italic ' : '';
        ctx.font = bold + italic + this.config.fontSize + 'px ' + this.config.textFont;

        ctx.textAlign = this.config.alignmentSetting as CanvasTextAlign;
        this.handleAlign(ctx);

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
        if (this.config.hasInput) {
            this.drawCursor(ctx);
        }
    }

    private drawCursor(ctx: CanvasRenderingContext2D): void {
        switch (this.config.alignmentSetting) {
            case TextAlignment.Left:
                this.drawCursorLeft(ctx);
                break;
            case TextAlignment.Right:
                this.drawCursorRight(ctx);
                break;
            case TextAlignment.Center:
                this.drawCursorCenter(ctx);
        }
    }

    private drawCursorLeft(ctx: CanvasRenderingContext2D): void {
        const left = this.config.textData[this.config.index.y].slice(0, this.config.index.x);
        this.cursor.x = this.config.startCoords.x + ctx.measureText(left).width;
        this.cursor.y = this.config.startCoords.y + this.config.fontSize * this.config.index.y;
        const height = this.config.fontSize;

        ctx.lineWidth = 1;

        this.drawLineCursor(ctx, height);
    }

    private drawCursorRight(ctx: CanvasRenderingContext2D): void {
        const right = this.config.textData[this.config.index.y].slice(this.config.index.x);
        this.cursor.x = this.config.startCoords.x - ctx.measureText(right).width;
        this.cursor.y = this.config.startCoords.y + this.config.fontSize * this.config.index.y;
        const height = this.config.fontSize;

        ctx.lineWidth = 1;

        this.drawLineCursor(ctx, height);
    }

    private drawCursorCenter(ctx: CanvasRenderingContext2D): void {
        const newStartCoords = this.config.startCoords.clone();
        const text = this.config.textData[this.config.index.y];
        const metricsText = ctx.measureText(text);
        newStartCoords.x -= metricsText.width / 2;

        const left = this.config.textData[this.config.index.y].slice(0, this.config.index.x);
        this.cursor.x = newStartCoords.x + ctx.measureText(left).width;
        this.cursor.y = this.config.startCoords.y + this.config.fontSize * this.config.index.y;

        const height = this.config.fontSize;

        ctx.lineWidth = 1;

        this.drawLineCursor(ctx, height);
    }

    private drawLineCursor(ctx: CanvasRenderingContext2D, height: number): void {
        ctx.beginPath();
        ctx.moveTo(this.cursor.x, this.cursor.y);
        ctx.lineTo(this.cursor.x, this.cursor.y + height);
        ctx.stroke();
    }

    private handleAlign(ctx: CanvasRenderingContext2D): void {
        switch (this.config.alignmentSetting) {
            case TextAlignment.Left:
                this.alignLeft(ctx);
                break;
            case TextAlignment.Right:
                this.alignRight(ctx);
                break;
            case TextAlignment.Center:
                this.alignCenter(ctx);
        }
    }

    private alignLeft(ctx: CanvasRenderingContext2D): void {
        if (this.config.newAlignment) {
            let maxLineWidth: number = ctx.measureText('').width;
            this.config.textData.forEach((line) => {
                maxLineWidth = Math.max(maxLineWidth, ctx.measureText(line).width);
            });
            if (this.config.lastAlignment === TextAlignment.Center) maxLineWidth = maxLineWidth / 2;
            this.config.startCoords.x = this.config.startCoords.x - maxLineWidth;
            this.textConfig.startCoords.x = this.config.startCoords.x;
        }
    }

    private alignRight(ctx: CanvasRenderingContext2D): void {
        if (this.config.newAlignment) {
            let maxLineWidth: number = ctx.measureText('').width;
            this.config.textData.forEach((line) => {
                maxLineWidth = Math.max(maxLineWidth, ctx.measureText(line).width);
            });
            if (this.config.lastAlignment === TextAlignment.Center) maxLineWidth = maxLineWidth / 2;
            this.config.startCoords.x = this.config.startCoords.x + maxLineWidth;
            this.textConfig.startCoords.x = this.config.startCoords.x;
        }
    }

    private alignCenter(ctx: CanvasRenderingContext2D): void {
        if (this.config.newAlignment) {
            this.config.newAlignment = false;
            let maxLineWidth: number = ctx.measureText('').width;
            this.config.textData.forEach((line) => {
                maxLineWidth = Math.max(maxLineWidth, ctx.measureText(line).width);
            });
            if (this.config.lastAlignment === TextAlignment.Right) maxLineWidth = -maxLineWidth;
            this.config.startCoords.x = this.config.startCoords.x + maxLineWidth / 2;
            this.textConfig.startCoords.x = this.config.startCoords.x;
        }
    }
}
