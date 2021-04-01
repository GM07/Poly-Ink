import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ColorService } from 'src/color-picker/services/color.service';
import { BucketConfig } from './../tool-config/bucket-config';
export class BucketDraw extends AbstractDraw {
    private config: BucketConfig;
    private queue: number[];
    private visited: Set<number>;
    private originalPixel: Uint8ClampedArray;
    private pixels: ImageData;

    // Max euclidian distance for 3 colors (255^2 * 3)
    private readonly MaxColorDifference = 195075;

    private readonly R = 0;
    private readonly G = 1;
    private readonly B = 2;
    private readonly DataPerPixel = 4;

    constructor(colorService: ColorService, config: BucketConfig) {
        super(colorService);
        this.config = config.clone();
        this.queue = [];
        this.originalPixel = new Uint8ClampedArray(this.DataPerPixel);

        this.config.point.x = Math.floor(this.config.point.x);
        this.config.point.y = Math.floor(this.config.point.y);
    }

    execute(context: CanvasRenderingContext2D): void {
        this.pixels = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

        this.getOriginalPixel(context);

        if (this.config.contiguous) this.floodFill(context.canvas.width);
        else this.pixelFill();

        context.putImageData(this.pixels, 0, 0);
    }

    private floodFill(width: number) {
        this.visited = new Set<number>();

        const startIndex = (this.config.point.x + this.config.point.y * width) * this.DataPerPixel;
        this.queue.push(startIndex);

        while (this.queue.length > 0) {
            const pos = this.queue.pop() as number;

            if (this.shouldFill(pos)) {
                this.setPixel(pos);

                //Takes canvas borders into consideration
                if (((pos + 4) >> 2) % width !== 0) {
                    this.addAdjacent(pos + 4);
                }

                //Takes canvas borders into consideration
                if (((pos - 4) >> 2) % width !== width - 1) {
                    this.addAdjacent(pos - 4);
                }

                this.addAdjacent(pos + width * this.DataPerPixel);
                this.addAdjacent(pos - width * this.DataPerPixel);
            }
        }
    }

    private pixelFill() {
        for (let i = 0; i < this.pixels.data.length; i += this.DataPerPixel) {
            if (this.shouldFill(i)) {
                this.setPixel(i);
            }
        }
    }

    addAdjacent(pos: number) {
        if (pos < 0 || pos >= this.pixels.data.length) return;
        if (this.visited.has(pos)) return;

        this.visited.add(pos);
        this.queue.push(pos);
    }

    private shouldFill(pos: number): boolean {
        const pixel = this.pixels.data.subarray(pos, pos + this.DataPerPixel);

        const deltaR2 = Math.pow(pixel[this.R] - this.originalPixel[this.R], 2);
        const deltaG2 = Math.pow(pixel[this.G] - this.originalPixel[this.G], 2);
        const deltaB2 = Math.pow(pixel[this.B] - this.originalPixel[this.B], 2);

        const colorDifference = deltaB2 + deltaG2 + deltaR2;
        const toleratedColorDifference = this.MaxColorDifference * (this.config.tolerance / 100);

        return colorDifference <= toleratedColorDifference;
    }

    private setPixel(pos: number): void {
        const previousPixel = this.pixels.data.subarray(pos, pos + this.DataPerPixel);

        const R = this.primary.r * this.primaryAlpha + (1 - this.primaryAlpha) * previousPixel[this.R];
        const G = this.primary.g * this.primaryAlpha + (1 - this.primaryAlpha) * previousPixel[this.G];
        const B = this.primary.b * this.primaryAlpha + (1 - this.primaryAlpha) * previousPixel[this.B];

        this.pixels.data.set([R, G, B], pos);
    }

    private getOriginalPixel(context: CanvasRenderingContext2D): void {
        const arrayPos = (this.config.point.x + this.config.point.y * context.canvas.width) * this.DataPerPixel;

        for (let i = 0; i < this.DataPerPixel; ++i) {
            this.originalPixel[i] = this.pixels.data[arrayPos + i];
        }
    }
}
