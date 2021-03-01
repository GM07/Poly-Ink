import { Filter } from './filter';

export class FunkyFilter extends Filter {
    private static readonly RED_GREEN_FACTOR = 0.48;

    apply(image: ImageData): void {
        for (let i = 0; i < image.data.length; i += Filter.PIXEL_FORMAT_LENGTH) {
            let r: number = image.data[i + 0];
            let g: number = image.data[i + 1];
            let b: number = image.data[i + 2];

            let funkyFactor = r * FunkyFilter.RED_GREEN_FACTOR + g * FunkyFilter.RED_GREEN_FACTOR;

            image.data[i + 0] = Math.max(0, Math.min(255, Math.round(r - funkyFactor)));
            image.data[i + 1] = Math.max(0, Math.min(255, Math.round(g + (r % funkyFactor))));
            image.data[i + 2] = Math.max(0, Math.min(255, Math.round(b - ((g - r) % funkyFactor))));
        }
    }
}
