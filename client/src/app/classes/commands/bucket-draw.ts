import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ColorService } from 'src/color-picker/services/color.service';
import { BucketConfig } from './../tool-config/bucket-config';
export class BucketDraw extends AbstractDraw {
    private config: BucketConfig;
    private queue: number[];
    private originalPixel: Uint8ClampedArray;
    private fillPixel: Uint8ClampedArray;
    private pixels: ImageData;

    private readonly MaxColorDifference = Math.pow(255, 2) * 3;
    private readonly R = 0;
    private readonly G = 1;
    private readonly B = 2;
    private readonly DataPerPixel = 4;

    constructor(colorService: ColorService, config: BucketConfig) {
        super(colorService);
        this.config = config.clone();
        this.queue = [];
        this.originalPixel = new Uint8ClampedArray(this.DataPerPixel);
    }

    execute(context: CanvasRenderingContext2D): void {
        this.pixels = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

        this.config.point.x = Math.floor(this.config.point.x);
        this.config.point.y = Math.floor(this.config.point.y);

        this.setupFillPixel();
        this.getOriginalPixel(context);

        if (this.config.contiguous) this.floodFill(context);
        else this.pixelFill(context);

        context.putImageData(this.pixels, 0, 0);
    }

    private floodFill(context: CanvasRenderingContext2D) {
        const width = context.canvas.width;
        const startIndex = (this.config.point.x + this.config.point.y * width) * this.DataPerPixel;
        this.queue.push(startIndex);
        this.fillPixel[3] = 0;

        while (this.queue.length > 0) {
            const pos = this.queue.pop() as number;

            const pixel = this.pixels.data.subarray(pos, pos + this.DataPerPixel);

            if (this.shouldFill(pixel) && this.isNotAlreadyFilled(pixel)) {
                this.pixels.data.set(this.fillPixel, pos);
                this.addAdjacent(pos + 4);
                this.addAdjacent(pos - 4);
                this.addAdjacent(pos + width * this.DataPerPixel);
                this.addAdjacent(pos - width * this.DataPerPixel);
            }
        }

        for (let i = 3; i < this.pixels.data.length; i += this.DataPerPixel) {
            this.pixels.data[i] = 255;
        }
    }

    private pixelFill(context: CanvasRenderingContext2D) {
        for (let i = 0; i < this.pixels.data.length; i += this.DataPerPixel) {
            const pixel = this.pixels.data.subarray(i, i + this.DataPerPixel);
            if (this.shouldFill(pixel)) {
                this.pixels.data.set(this.fillPixel, i);
            }
        }
    }

    addAdjacent(pos: number) {
        if (pos < 0 || pos >= this.pixels.data.length) return;
        this.queue.push(pos);
    }

    private isNotAlreadyFilled(pixel: Uint8ClampedArray): boolean {
        return pixel[3] !== 0;
    }

    private shouldFill(pixel: Uint8ClampedArray): boolean {
        //TODO Implement perceptually accurate difference: https://en.wikipedia.org/wiki/Color_difference

        const deltaR2 = Math.pow(pixel[this.R] - this.originalPixel[this.R], 2);
        const deltaG2 = Math.pow(pixel[this.G] - this.originalPixel[this.G], 2);
        const deltaB2 = Math.pow(pixel[this.B] - this.originalPixel[this.B], 2);

        const colorDifference = deltaR2 + deltaG2 + deltaB2;
        const toleratedColorDifference = this.MaxColorDifference * (this.config.tolerance / 100);

        return colorDifference <= toleratedColorDifference;
    }

    private setupFillPixel(): void {
        this.fillPixel = new Uint8ClampedArray([this.primary.r, this.primary.g, this.primary.b, 255]);
    }

    private getOriginalPixel(context: CanvasRenderingContext2D): void {
        const arrayPos = (this.config.point.x + this.config.point.y * context.canvas.width) * this.DataPerPixel;

        for (let i = 0; i < this.DataPerPixel; ++i) {
            this.originalPixel[i] = this.pixels.data[arrayPos + i];
        }
    }
}
