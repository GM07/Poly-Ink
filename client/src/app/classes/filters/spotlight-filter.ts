import { Geometry } from '@app/classes/math/geometry';
import { Vec2 } from '@app/classes/vec2';
import { Filter } from './filter';

export class SpotlightFilter extends Filter {
    apply(image: ImageData): void {
        const imageCenter: Vec2 = new Vec2(Math.floor(image.width / 2), Math.floor(image.height / 2));

        for (let i = 0; i < image.data.length; i += Filter.PIXEL_FORMAT_LENGTH) {
            const r: number = image.data[i + 0];
            const g: number = image.data[i + 1];
            const b: number = image.data[i + 2];

            const distanceFromCenter = Geometry.getDistanceBetween(this.getPositionOfPixel(image.width, i), imageCenter);
            const darknessFactor = (distanceFromCenter / Math.max(image.width / 2, image.height / 2)) * Filter.MAX_RBGA_VALUE;

            image.data[i + 0] = Math.max(0, r - darknessFactor);
            image.data[i + 1] = Math.max(0, g - darknessFactor);
            image.data[i + 2] = Math.max(0, b - darknessFactor);
        }
    }

    getPositionOfPixel(width: number, index: number): Vec2 {
        const pixelIndex: number = Math.floor(index / Filter.PIXEL_FORMAT_LENGTH);

        const xPos = pixelIndex % width;
        const yPos = Math.floor(pixelIndex / width);

        return new Vec2(xPos, yPos);
    }
}
