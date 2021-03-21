import { Filter } from './filter';

/**
 * Values found for this filter are based on the Sepia algorithm
 * http://leware.net/photo/blogSepia.html
 */

/* tslint:disable:no-magic-numbers */
export class SepiaFilter extends Filter {
    apply(image: ImageData): void {
        for (let i = 0; i < image.data.length; i += Filter.PIXEL_FORMAT_LENGTH) {
            const r: number = image.data[i + 0];
            const g: number = image.data[i + 1];
            const b: number = image.data[i + 2];

            image.data[i + 0] = Math.max(0, Math.min(255, Math.round(r * 0.393 + g * 0.769 + b * 0.189)));
            image.data[i + 1] = Math.max(0, Math.min(255, Math.round(r * 0.349 + g * 0.686 + b * 0.168)));
            image.data[i + 2] = Math.max(0, Math.min(255, Math.round(r * 0.272 + g * 0.534 + b * 0.131)));
        }
    }
}
