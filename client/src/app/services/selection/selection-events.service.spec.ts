import { TestBed } from '@angular/core/testing';

import { SelectionEventsService } from './selection-events.service';

describe('SelectionEventsService', () => {
    let service: SelectionEventsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SelectionEventsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
