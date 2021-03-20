import { HttpErrorResponse } from '@angular/common/http';
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

  service = TestBed.inject(CarrouselService);
  httpMock = TestBed.inject(HttpTestingController);

  it('should be created', () => {
      expect(service).toBeTruthy();
  });

  fit('should return an Observable<>', () => {
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
  });

  it('should send a request GET and should send tags in query', () => {
    const dummyTags: Tag[] = [{name: "tag1"}];
    service.getFilteredDrawings(dummyTags)
      .subscribe(filteredDrawings => {
        expect(filteredDrawings.length).toBe(1);
      });

      const req = httpMock.expectOne(`${CarrouselService.baseURL}?tags=tag1`);
      expect(req.request.url).toBe(`${CarrouselService.baseURL}?tags=tag1`);
      expect(req.request.method).toBe('GET');
  });

  it('should testConnection', () => {
    let isOnline;
    service.testConnection().subscribe(value => isOnline = value);
    window.dispatchEvent(new Event('offline'));
    expect(isOnline).toBeFalse();
  
    window.dispatchEvent(new Event('online'));
    expect(isOnline).toBeTrue();
  });
  
  it('should send a DELETE request', () => {
    service.deleteDrawing(dummyDrawing).subscribe();
    const req = httpMock.expectOne(`${CarrouselService.baseURL}?ids=604a1a5a1b66eefab31e9206`);
    expect(req.request.method).toBe("DELETE");
    req.flush(dummyDrawings);
  });
  
  it('should throw error', () => {
    service.deleteDrawing(dummyDrawing).subscribe(
      data => fail(' '), 
      (error: HttpErrorResponse) => {
        expect(error.status).toBeDefined();
      }
    )
    const req = httpMock.expectOne(`${CarrouselService.baseURL}?ids=604a1a5a1b66eefab31e9206`);
    req.flush('404 error', { status: 404, statusText: 'Not Found' });
  });

  it('should send a request POST', () => {
      service.createDrawing(dummyDrawing).subscribe();

      const req = httpMock.expectOne(`${CarrouselService.baseURL}`);
      expect(req.request.method).toBe('POST');
      req.flush(dummyDrawings);
  });
});
