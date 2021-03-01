import { Filter } from './filter';

/**
 * Les valeurs trouvées pour ce filtre sont basées sur l'algorithme Sepia
 * http://leware.net/photo/blogSepia.html
 */

/* tslint:disable:no-magic-numbers */
export class SepiaFilter extends Filter {
    apply(image: ImageData): void {
        for (let i = 0; i < image.data.length; i += Filter.PIXEL_FORMAT_LENGTH) {
            let r: number = image.data[i + 0];
            let g: number = image.data[i + 1];
            let b: number = image.data[i + 2];

            image.data[i + 0] = r * 0.393 + g * 0.769 + b * 0.189;
            image.data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
            image.data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
        }
    }
}
