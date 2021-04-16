import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { BucketConfig } from '@app/classes/tool-config/bucket-config';
import { ColorService } from '@app/services/color/color.service';
export class BucketDraw extends AbstractDraw {
    private config: BucketConfig;
    private queue: number[];
    private visited: Set<number>;
    private originalPixel: Uint8ClampedArray;
    private pixels: ImageData;

    // Max euclidian distance for 3 colors Math.sqrt(255^2 * 3)
    // tslint:disable-next-line:no-magic-numbers
    private readonly maxColorDifference: number = Math.sqrt(Math.pow(255, 2) * 3);

    private readonly R: number = 0;
    private readonly G: number = 1;
    private readonly B: number = 2;
    private readonly colorComponentMax: number = 255;
    private readonly dataPerPixel: number = 4;

    constructor(colorService: ColorService, config: BucketConfig) {
        super(colorService);
        this.config = config.clone();
        this.queue = [];
        this.originalPixel = new Uint8ClampedArray(this.dataPerPixel);

        this.config.point = this.config.point.apply(Math.floor);
    }

    execute(context: CanvasRenderingContext2D): void {
        this.pixels = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

        this.saveOriginalPixel(context);

        if (this.config.contiguous) this.floodFill(context.canvas.width);
        else this.pixelFill();

        context.putImageData(this.pixels, 0, 0);
    }

    private floodFill(width: number): void {
        this.visited = new Set<number>();

        const startIndex = (this.config.point.x + this.config.point.y * width) * this.dataPerPixel;
        this.queue.push(startIndex);

        while (this.queue.length > 0) {
            const pos = this.queue.pop() as number;

            if (this.shouldFill(pos)) {
                this.setPixel(pos);

                // Takes canvas borders into consideration
                if (((pos + this.dataPerPixel) / this.dataPerPixel) % width !== 0) {
                    this.addAdjacent(pos + this.dataPerPixel);
                }

                // Takes canvas borders into consideration
                if (((pos - this.dataPerPixel) / this.dataPerPixel) % width !== width - 1) {
                    this.addAdjacent(pos - this.dataPerPixel);
                }

                this.addAdjacent(pos + width * this.dataPerPixel);
                this.addAdjacent(pos - width * this.dataPerPixel);
            }
        }
    }

    private pixelFill(): void {
        for (let i = 0; i < this.pixels.data.length; i += this.dataPerPixel) {
            if (this.shouldFill(i)) {
                this.setPixel(i);
            }
        }
    }

    private addAdjacent(pos: number): void {
        if (pos < 0 || pos >= this.pixels.data.length || this.visited.has(pos)) return;

        this.visited.add(pos);
        this.queue.push(pos);
    }

    private shouldFill(pos: number): boolean {
        const pixel = this.pixels.data.subarray(pos, pos + this.dataPerPixel);

        const deltaR2 = Math.pow(pixel[this.R] - this.originalPixel[this.R], 2);
        const deltaG2 = Math.pow(pixel[this.G] - this.originalPixel[this.G], 2);
        const deltaB2 = Math.pow(pixel[this.B] - this.originalPixel[this.B], 2);

        const colorDifference = Math.sqrt(deltaB2 + deltaG2 + deltaR2);

        // tslint:disable-next-line:no-magic-numbers
        const toleratedColorDifference = this.maxColorDifference * (this.config.tolerance / 100);

        return colorDifference <= toleratedColorDifference;
    }

    private setPixel(pos: number): void {
        const previousPixel = this.pixels.data.subarray(pos, pos + this.dataPerPixel);
        const R = this.primary.r * this.primaryAlpha + (1 - this.primaryAlpha) * previousPixel[this.R];
        const G = this.primary.g * this.primaryAlpha + (1 - this.primaryAlpha) * previousPixel[this.G];
        const B = this.primary.b * this.primaryAlpha + (1 - this.primaryAlpha) * previousPixel[this.B];

        this.pixels.data.set([R, G, B, this.colorComponentMax], pos);
    }

    private saveOriginalPixel(context: CanvasRenderingContext2D): void {
        const arrayPos = (this.config.point.x + this.config.point.y * context.canvas.width) * this.dataPerPixel;

        for (let i = 0; i < this.dataPerPixel; ++i) {
            this.originalPixel[i] = this.pixels.data[arrayPos + i];
        }
    }
}
