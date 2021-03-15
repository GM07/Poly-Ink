import { TestBed } from '@angular/core/testing';
import { SepiaFilter } from './sepia-filter';

/* tslint:disable:no-magic-numbers */

describe('Sepia filter', () => {
    let filter: SepiaFilter;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        filter = new SepiaFilter();
    });

    it('should apply filter', () => {
        const data = [200, 100, 0, 255];
        const array = new Uint8ClampedArray(data);
        const image = new ImageData(array, 1, 1);
        filter.apply(image);

        expect(image.data).toEqual(new Uint8ClampedArray([156, 138, 108, 255]));
    });
});
