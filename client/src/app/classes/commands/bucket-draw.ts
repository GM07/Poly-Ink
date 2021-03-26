import { AbstractDraw } from '@app/classes/commands/abstract-draw';
import { ColorService } from 'src/color-picker/services/color.service';
import { BucketConfig } from './../tool-config/bucket-config';

interface spanData {
    x1: number;
    x2: number;
    dx: number;
}
export class BucketDraw extends AbstractDraw {
    private config: BucketConfig;
    private queue: number[];
    private scanQueue: spanData[];
    private visited: boolean[];
    private originalPixel: Uint8ClampedArray;
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
        this.scanQueue = [];
        this.originalPixel = new Uint8ClampedArray(this.DataPerPixel);

        this.config.point.x = Math.floor(this.config.point.x);
        this.config.point.y = Math.floor(this.config.point.y);
    }

    execute(context: CanvasRenderingContext2D): void {
        this.pixels = context.getImageData(0, 0, context.canvas.width, context.canvas.height);

        this.getOriginalPixel(context);

        if (this.config.contiguous) this.floodFill(context);
        else this.spanFill(context);

        context.putImageData(this.pixels, 0, 0);
    }

    private floodFill(context: CanvasRenderingContext2D) {
        const width = context.canvas.width;
        const height = context.canvas.height;

        this.visited = new Array<boolean>(width * height).fill(false);

        const startIndex = (this.config.point.x + this.config.point.y * width) * this.DataPerPixel;
        this.queue.push(startIndex);

        while (this.queue.length > 0) {
            const pos = this.queue.pop() as number;

            if (this.shouldFill(pos)) {
                this.setPixel(pos);
                this.visited[Math.floor(pos >> 2)] = true;

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

    // Span Filling Algorithm from : https://en.wikipedia.org/wiki/Flood_fill
    private spanFill(context: CanvasRenderingContext2D) {
        const width = context.canvas.width;
        const dx = width * this.DataPerPixel;
        const height = context.canvas.height;

        this.visited = new Array<boolean>(width * height).fill(false);
        const startIndex = (this.config.point.x + this.config.point.y * width) * this.DataPerPixel;

        this.scanQueue.push({ x1: startIndex, x2: startIndex, dx: dx });
        this.scanQueue.push({ x1: startIndex - dx, x2: startIndex - dx, dx: -dx });

        while (this.scanQueue.length > 0) {
            const spanData = this.scanQueue.pop() as spanData;
            let x = spanData.x1;

            if (this.shouldFill(x)) {
                // Considers canvas border as edges
                while ((x >> 2) % width !== 0 && this.shouldFill(x - this.DataPerPixel)) {
                    this.setPixel(x - this.DataPerPixel);
                    this.visited[(x - this.DataPerPixel) >> 2] = true;
                    x -= this.DataPerPixel;
                }
            }

            if (x < spanData.x1) {
                this.scanQueue.push({ x1: x - spanData.dx, x2: spanData.x1 - this.DataPerPixel - spanData.dx, dx: -spanData.dx });
            }

            while (spanData.x1 < spanData.x2) {
                while (this.shouldFill(spanData.x1)) {
                    this.setPixel(spanData.x1);
                    this.visited[spanData.x1 >> 2] = true;

                    // Considers canvas border as edges
                    if ((spanData.x1 >> 2) % width !== width - 1) {
                        spanData.x1 += this.DataPerPixel;
                    }
                }

                this.scanQueue.push({ x1: x + spanData.dx, x2: spanData.x1 - this.DataPerPixel + spanData.dx, dx: spanData.dx });

                if (spanData.x1 - this.DataPerPixel > spanData.x2) {
                    this.scanQueue.push({
                        x1: spanData.x2 + this.DataPerPixel - spanData.dx,
                        x2: spanData.x1 - this.DataPerPixel - spanData.dx,
                        dx: -spanData.dx,
                    });
                }

                // Considers canvas border as edges
                while (spanData.x1 < spanData.x2 && !this.shouldFill(spanData.x1) && (spanData.x1 >> 2) % width !== width - 1) {
                    spanData.x1 += this.DataPerPixel;
                }

                x = spanData.x1;
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
        this.queue.push(pos);
    }

    private shouldFill(pos: number): boolean {
        //Pixel is out of bounds
        if (pos < 0 || pos > this.pixels.data.length - 4) return false;

        //Pixel has been visited
        if (this.visited[pos >> 2]) return false;

        //TODO Implement perceptually accurate difference: https://en.wikipedia.org/wiki/Color_difference
        const pixel = this.pixels.data.subarray(pos, pos + this.DataPerPixel);

        const deltaR2 = Math.pow(pixel[this.R] - this.originalPixel[this.R], 2);
        const deltaG2 = Math.pow(pixel[this.G] - this.originalPixel[this.G], 2);
        const deltaB2 = Math.pow(pixel[this.B] - this.originalPixel[this.B], 2);

        const colorDifference = deltaR2 + deltaG2 + deltaB2;
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
