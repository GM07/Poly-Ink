import { TestBed } from '@angular/core/testing';

import { ExportImgurService } from './export-imgur.service';

describe('ExportImgurService', () => {
  let service: ExportImgurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportImgurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
