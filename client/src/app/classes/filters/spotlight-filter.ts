import { Geometry } from '../math/geometry';
import { Vec2 } from '../vec2';
import { Filter } from './filter';

export class SpotlightFilter extends Filter {
    apply(image: ImageData): void {
        let imageCenter: Vec2 = { x: Math.floor(image.width / 2), y: Math.floor(image.height / 2) };

        for (let i = 0; i < image.data.length; i += Filter.PIXEL_FORMAT_LENGTH) {
            let r: number = image.data[i + 0];
            let g: number = image.data[i + 1];
            let b: number = image.data[i + 2];

            let distanceFromCenter = Geometry.getDistanceBetween(this.getPositionOfPixel(image.width, i), imageCenter);
            let darknessFactor = (distanceFromCenter / Math.max(image.width / 2, image.height / 2)) * Filter.MAX_RBGA_VALUE;

            image.data[i + 0] = Math.max(0, r - darknessFactor);
            image.data[i + 1] = Math.max(0, g - darknessFactor);
            image.data[i + 2] = Math.max(0, b - darknessFactor);
        }
    }

    getPositionOfPixel(width: number, index: number): Vec2 {
        let pixelIndex: number = Math.floor(index / Filter.PIXEL_FORMAT_LENGTH);

        let x = pixelIndex % width;
        let y = Math.floor(pixelIndex / width);

        return { x: x, y: y } as Vec2;
    }
}
