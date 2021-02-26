import { Filter } from './filter';

export class RandomFilter implements Filter {
    apply(image: ImageData): void {
        for (let i = 0; i < image.data.length; i += 2 * 2) {
            image.data[i] = Math.random() * 255;
            image.data[i + 1] = Math.random() * 255;
            image.data[i + 2] = Math.random() * 255;
        }
    }
}
