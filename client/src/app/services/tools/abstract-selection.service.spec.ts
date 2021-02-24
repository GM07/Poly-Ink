import { TestBed } from '@angular/core/testing';

import { AbstractSelectionService } from './abstract-selection.service';

describe('AbsractSelectionService', () => {
    let service: AbstractSelectionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AbstractSelectionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
