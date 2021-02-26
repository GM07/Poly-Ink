import { Filter } from './filter';

export class NegativeFilter implements Filter {
    apply(image: ImageData): void {
        for (let i = 0; i < image.data.length; i += 2 * 2) {
            let r = image.data[i];
            let g = image.data[i + 1];
            let b = image.data[i + 2];

            image.data[i] = 255 - r;
            image.data[i + 1] = 255 - g;
            image.data[i + 2] = 255 - b;
        }
    }
}
