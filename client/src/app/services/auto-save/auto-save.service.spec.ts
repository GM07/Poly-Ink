import { TestBed } from '@angular/core/testing';
import { AutoSaveService } from './auto-save.service';


describe('AutoSaveServiceService', () => {
  let service: AutoSaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoSaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
