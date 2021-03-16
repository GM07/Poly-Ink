import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Drawing } from '@common/communication/drawing';
import { Tag } from '@common/communication/tag';
import { CarrouselService } from './carrousel.service';

const dummyDrawing: Drawing = {
  data: {
    tags: [{name: "tag1"}, {name: "tag2"}],
    name: "Monsieur",
    _id: "604a1a5a1b66eefab31e9206"
  },
  "image": "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" 
}

const dummyDrawings: Drawing[] = [dummyDrawing]

describe('CarrouselService', () => {
  let httpMock : HttpTestingController;
  let service: CarrouselService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CarrouselService]
    });
    service = TestBed.inject(CarrouselService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an Observable<>', () => {
    service.getAllDrawings().subscribe(drawings => {
      expect(drawings.length).toBe(1);
      expect(drawings).toEqual(dummyDrawings);
    });

    const req = httpMock.expectOne(`${service.baseURL}`);
    expect(req.request.method).toBe("GET");
    req.flush(dummyDrawings);
  });

  //TODO should verify if no drawings match the tag!
  it('should send a request GET and should send tags in query', () => {
    const dummyTags: Tag[] = [{name: "tag1"}];
    service.getFilteredDrawings(dummyTags)
      .subscribe(filteredDrawings => {
        expect(filteredDrawings.length).toBe(1);
      });

    const req = httpMock.expectOne(`${service.baseURL}?tags=tag1`);
    expect(req.request.url).toBe(`${service.baseURL}?tags=tag1`);
    //expect(service.noMatchingTags).toBe(false);
    expect(req.request.method).toBe("GET");
  })

  /*
  it('should send a request GET and should send tags in query', () => {
    const dummyTags: Tag[] = [{name: "dummyTag"}];
    service.getFilteredDrawings(dummyTags)
      .subscribe(filteredDrawings => {
        expect(filteredDrawings.length).toBe(1);
      });

    const req = httpMock.expectOne(`${service.baseURL}?tags=dummyTag`);
    expect(req.request.url).toBe(`${service.baseURL}?tags=dummyTag`);
    //expect(service.noMatchingTags).toBe(true);
    expect(req.request.method).toBe("GET");
  })*/

  it('should send a request DELETE', () => {
    service.deleteDrawingDataFromId(dummyDrawing).subscribe();

    const req = httpMock.expectOne(`${service.baseURL}?ids=604a1a5a1b66eefab31e9206`);
    expect(req.request.method).toBe("DELETE");
    req.flush(dummyDrawings);
  });
});
