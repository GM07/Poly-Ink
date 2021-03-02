import { TestBed } from '@angular/core/testing';
import { FunkyFilter } from './funky-filter';

/* tslint:disable:no-magic-numbers */
describe('Funky filter', () => {
    let filter: FunkyFilter;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        filter = new FunkyFilter();
    });

    it('should apply filter', () => {
        const data = [120, 0, 0, 255];
        const array = new Uint8ClampedArray(data);
        const image = new ImageData(array, 1, 1);
        filter.apply(image);

        expect(image.data).toEqual(new Uint8ClampedArray([60, 48, 12, 255]));
        //
    });
});
