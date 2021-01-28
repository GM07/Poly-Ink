import { TestBed } from '@angular/core/testing';
import { LineService } from './line-service';

// tslint:disable:no-any
describe('LigneService', () => {
    let service: LineService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LineService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should stop drawing when asked to', () => {
        spyOn<any>(service, 'stopDrawing').and.callThrough();
        service.stopDrawing();
        expect(service.stopDrawing).toHaveBeenCalled();
    });
});
