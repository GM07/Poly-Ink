import { TestBed } from '@angular/core/testing';

import { ToolHandlerService } from './toolHandler-service';

describe('HeroService', () => {
  let service: ToolHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToolHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
