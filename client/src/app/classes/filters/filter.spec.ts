import { TestBed } from '@angular/core/testing';
import { Filter } from './filter';

/* tslint:disable:no-magic-numbers */
describe('Default filter', () => {
    let filter: Filter;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        filter = new Filter();
    });

    it('should apply filter', () => {
        const data = [120, 0, 0, 255, 160, 160, 160, 255];
        const array = new Uint8ClampedArray(data);
        const image = new ImageData(array, 1, 2);
        filter.apply(image);

        expect(image.data).toEqual(array);
    });
});
