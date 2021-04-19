import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ImgurResponse } from '@app/classes/imgur-res';
import { ImgurDataResponse } from '@app/classes/imgur-res-data';
import { ExportImgurService } from './export-imgur.service';

describe('ExportImgurService', () => {
    let service: ExportImgurService;
    let httpMock: HttpTestingController;
    let dummyImgurResponse: ImgurResponse;
    let dummyImgurResponseData: ImgurDataResponse;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(ExportImgurService);
        httpMock = TestBed.inject(HttpTestingController);
        dummyImgurResponse = new ImgurResponse();
        dummyImgurResponse.status = '200';
        dummyImgurResponseData = new ImgurDataResponse();
        dummyImgurResponseData.link = 'https://imgur.com/1234';
        dummyImgurResponseData.name = 'imgur_image_name';
        dummyImgurResponseData.type = 'png';
        dummyImgurResponse.data = dummyImgurResponseData;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should send a request POST', () => {
        service.exportImage('imgur_image_name', 'png', 'image_name').subscribe();
        const req = httpMock.expectOne(`${ExportImgurService.BASE_URL}/image`);
        expect(req.request.method).toBe('POST');
        req.flush(dummyImgurResponse);
    });
});
