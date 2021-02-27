import { Filter } from './filter';

export class FunkyFilter extends Filter {
    apply(image: ImageData): void {
        for (let i = 0; i < image.data.length; i += 2 * 2) {
            let r: number = image.data[i + 0];
            let g: number = image.data[i + 1];
            let b: number = image.data[i + 2];

            let luminosity = 0.21 * r + 0.72 * g + 0.07 * b;

            image.data[i] = Math.round(r * luminosity);
            image.data[i] = Math.round(g * luminosity);
            image.data[i] = Math.round(b * luminosity);
        }
    }
}
