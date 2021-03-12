import { TestBed } from '@angular/core/testing';
import { SpotlightFilter } from './spotlight-filter';

/* tslint:disable:no-magic-numbers */
describe('Spotlight filter', () => {
    let filter: SpotlightFilter;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        filter = new SpotlightFilter();
    });

    it('should apply filter', () => {
        const data: number[] = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 4; k++) {
                    data.push(255);
                }
            }
        }

        const array = new Uint8ClampedArray(data);
        const image = new ImageData(array, 3, 3);
        filter.apply(image);

        const middleElement = image.data[20];
        const topLeftElement = image.data[0];

        expect(middleElement).toBeGreaterThan(topLeftElement);
    });
});
