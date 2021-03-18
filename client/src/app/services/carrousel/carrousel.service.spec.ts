import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Drawing } from '@common/communication/drawing';
import { Tag } from '@common/communication/tag';
import { dummyDrawing } from './carrousel.const';
import { CarrouselService } from './carrousel.service';

const dummyDrawings: Drawing[] = [dummyDrawing];

describe('CarrouselService', () => {
    let httpMock: HttpTestingController;
    let service: CarrouselService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [CarrouselService],
        });
        service = TestBed.inject(CarrouselService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return an Observable<>', () => {
        service.getAllDrawings().subscribe((drawings) => {
            expect(drawings.length).toBe(1);
            expect(drawings).toEqual(dummyDrawings);
        });

        const req = httpMock.expectOne(`${CarrouselService.baseURL}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyDrawings);
    });

    it('should return an Observable<> with a tag', () => {
        const dummyTags: Tag[] = [{ name: 'tag1' }];
        service.getFilteredDrawings(dummyTags).subscribe((filteredDrawings) => {
            expect(filteredDrawings.length).toBe(1);
        });

        const req = httpMock.expectOne(`${CarrouselService.baseURL}?tags=tag1`);
        expect(req.request.url).toBe(`${CarrouselService.baseURL}?tags=tag1`);
        expect(req.request.method).toBe('GET');
    });

    it('should send a request DELETE', () => {
        service.deleteDrawing(dummyDrawing).subscribe();

        const req = httpMock.expectOne(`${CarrouselService.baseURL}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(dummyDrawings);
    });

    it('should send a request POST', () => {
        service.createDrawing(dummyDrawing).subscribe();

        const req = httpMock.expectOne(`${CarrouselService.baseURL}`);
        expect(req.request.method).toBe('POST');
        req.flush(dummyDrawings);
    });
});
