import { TestBed } from '@angular/core/testing';

import { RectangleSelectionService } from './rectangle-selection.service';

describe('RectangleSelectionService', () => {
  let service: RectangleSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RectangleSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
