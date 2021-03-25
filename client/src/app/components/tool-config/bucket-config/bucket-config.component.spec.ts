import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketConfigComponent } from './bucket-config.component';

describe('BucketConfigComponent', () => {
  let component: BucketConfigComponent;
  let fixture: ComponentFixture<BucketConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
