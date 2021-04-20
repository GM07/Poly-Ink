import { Filter } from './filter';

// Mathematical formula
/* tslint:disable:no-magic-numbers */
export class FunkyFilter extends Filter {
    apply(image: ImageData): void {
        for (let i = 0; i < image.data.length; i += Filter.PIXEL_FORMAT_LENGTH) {
            const r: number = image.data[i + 0];
            const g: number = image.data[i + 1];
            const b: number = image.data[i + 2];

            image.data[i + 0] = r * 0.5 + g * 0.4 + b * 0.1;
            image.data[i + 1] = r * 0.4 + g * 0.5 + b * 0.1;
            image.data[i + 2] = r * 0.1 + g * 0.1 + b * 0.8;
        }
    }
}
