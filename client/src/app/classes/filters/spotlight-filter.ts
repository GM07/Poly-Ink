import { Filter } from './filter';

export class SpotlightFilter extends Filter {
    apply(image: ImageData): void {
        for (let i = 0; i < image.data.length; i += 2 * 2) {
            let r: number = image.data[i + 0];
            let g: number = image.data[i + 1];
            let b: number = image.data[i + 2];
        }
    }
}
