import { TestBed } from '@angular/core/testing';
import { Pipette } from './pipette.service.service';


describe('Pipette.ServiceService', () => {
  let service: Pipette;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pipette);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
