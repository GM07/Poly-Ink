import { TestBed } from '@angular/core/testing';

import { NewDrawingService } from './new-drawing.service';

describe('NewDrawingService', () => {
  let service: NewDrawingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewDrawingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
