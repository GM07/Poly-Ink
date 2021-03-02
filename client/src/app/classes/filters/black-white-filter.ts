import { Filter } from './filter';

/* tslint:disable:no-magic-numbers */
export class BlackWhiteFilter extends Filter {
    apply(image: ImageData): void {
        for (let i = 0; i < image.data.length; i += Filter.PIXEL_FORMAT_LENGTH) {
            const r: number = image.data[i + 0];
            const g: number = image.data[i + 1];
            const b: number = image.data[i + 2];

            const mean = (r + g + b) / 3;

            image.data[i + 0] = mean;
            image.data[i + 1] = mean;
            image.data[i + 2] = mean;
        }
    }
}
