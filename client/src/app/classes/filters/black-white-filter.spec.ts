import { TestBed } from '@angular/core/testing';
import { BlackWhiteFilter } from './black-white-filter';

/* tslint:disable:no-magic-numbers */
describe('Black and White filter', () => {
    let filter: BlackWhiteFilter;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        filter = new BlackWhiteFilter();
    });

    it('should apply filter', () => {
        const data = [120, 0, 0, 255, 160, 160, 160, 255];
        const array = new Uint8ClampedArray(data);
        const image = new ImageData(array, 1, 2);
        filter.apply(image);

        expect(image.data).toEqual(new Uint8ClampedArray([40, 40, 40, 255, 160, 160, 160, 255]));
    });
});
