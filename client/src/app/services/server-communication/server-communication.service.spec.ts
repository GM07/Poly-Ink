import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Drawing } from '@common/communication/drawing';
import { Tag } from '@common/communication/tag';
import { ServerCommunicationService } from './server-communication.service';

let dummyDrawing: Drawing;
let dummyDrawings: Drawing[];

describe('CarrouselService', () => {
    let httpMock: HttpTestingController;
    let service: ServerCommunicationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ServerCommunicationService],
        });
        service = TestBed.inject(ServerCommunicationService);
        httpMock = TestBed.inject(HttpTestingController);
        dummyDrawing = {
            data: {
                tags: [{ name: 'tag1' }, { name: 'tag2' }],
                name: 'Monsieur',
                _id: '604a1a5a1b66eefab31e9206',
            },
            image: '',
        };
        dummyDrawings = [dummyDrawing];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return an Observable<>', () => {
        service.getAllDrawings().subscribe((drawings) => {
            expect(drawings.length).toBe(1);
            expect(drawings).toEqual(dummyDrawings);
        });

        const req = httpMock.expectOne(`${ServerCommunicationService.baseURL}`);
        expect(req.request.method).toBe('GET');
        req.flush(dummyDrawings);
    });

    it('should return an Observable<> with a tag', () => {
        const dummyTags: Tag[] = [{ name: 'tag1' }];
        service.getFilteredDrawings(dummyTags).subscribe((filteredDrawings) => {
            expect(filteredDrawings.length).toBe(1);
        });

        const req = httpMock.expectOne(`${ServerCommunicationService.baseURL}?tags=tag1`);
        expect(req.request.url).toBe(`${ServerCommunicationService.baseURL}?tags=tag1`);
        expect(req.request.method).toBe('GET');
    });

    it('should send a request GET and should send tags in query', () => {
        const dummyTags: Tag[] = [{ name: 'tag1' }];
        service.getFilteredDrawings(dummyTags).subscribe((filteredDrawings) => {
            expect(filteredDrawings.length).toBe(1);
        });

        const req = httpMock.expectOne(`${ServerCommunicationService.baseURL}?tags=tag1`);
        expect(req.request.url).toBe(`${ServerCommunicationService.baseURL}?tags=tag1`);
        expect(req.request.method).toBe('GET');
    });

    it('should testConnection', () => {
        let isOnline;
        service.testConnection().subscribe((value) => (isOnline = value));
        window.dispatchEvent(new Event('offline'));
        expect(isOnline).toBeFalse();

        window.dispatchEvent(new Event('online'));
        expect(isOnline).toBeTrue();
    });

    it('should send a DELETE request', () => {
        service.deleteDrawing(dummyDrawing).subscribe();
        const req = httpMock.expectOne(`${ServerCommunicationService.baseURL}?ids=604a1a5a1b66eefab31e9206`);
        expect(req.request.method).toBe('DELETE');
        req.flush(dummyDrawings);
    });

    it('should throw error', () => {
        service.deleteDrawing(dummyDrawing).subscribe(
            (data) => fail(' '),
            (error: HttpErrorResponse) => {
                expect(error.status).toBeDefined();
            },
        );
        const req = httpMock.expectOne(`${ServerCommunicationService.baseURL}?ids=604a1a5a1b66eefab31e9206`);
        req.flush('404 error', { status: 404, statusText: 'Not Found' });
    });

    it('should send a request POST', () => {
        service.createDrawing(dummyDrawing).subscribe();

        const req = httpMock.expectOne(`${ServerCommunicationService.baseURL}`);
        expect(req.request.method).toBe('POST');
        req.flush(dummyDrawings);
    });
});
