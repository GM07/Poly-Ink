import { Filter } from './filter';

export class BlackWhiteFilter extends Filter {
    apply(image: ImageData): void {
        for (let i = 0; i < image.data.length; i += Filter.PIXEL_FORMAT_LENGTH) {
            let r: number = image.data[i + 0];
            let g: number = image.data[i + 1];
            let b: number = image.data[i + 2];

            let mean = (r + g + b) / 3;

            image.data[i + 0] = mean;
            image.data[i + 1] = mean;
            image.data[i + 2] = mean;
        }
    }
}
