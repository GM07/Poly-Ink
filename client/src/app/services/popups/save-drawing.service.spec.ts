import { TestBed } from '@angular/core/testing';
import { SaveDrawingService } from './save-drawing.service';

describe('SaveDrawingService', () => {
    let service: SaveDrawingService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SaveDrawingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
