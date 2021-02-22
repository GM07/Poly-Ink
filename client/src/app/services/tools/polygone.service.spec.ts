import { TestBed } from '@angular/core/testing';
import { PolygoneService } from './polygone.service';

describe('PolygoneService', () => {
    let service: PolygoneService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PolygoneService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
