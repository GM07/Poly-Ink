import { TestBed } from '@angular/core/testing';

import { EllipseSelectionService } from './ellipse-selection.service';

describe('EllipseSelectionService', () => {
    let service: EllipseSelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EllipseSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
