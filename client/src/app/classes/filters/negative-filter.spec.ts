import { TestBed } from '@angular/core/testing';
import { NegativeFilter } from './negative-filter';

/* tslint:disable:no-magic-numbers */
describe('Negative filter', () => {
    let filter: NegativeFilter;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        filter = new NegativeFilter();
    });

    it('should apply filter', () => {
        const data = [120, 0, 0, 255];
        const array = new Uint8ClampedArray(data);
        const image = new ImageData(array, 1, 1);
        filter.apply(image);

        expect(image.data).toEqual(new Uint8ClampedArray([135, 255, 255, 255]));
    });
});
