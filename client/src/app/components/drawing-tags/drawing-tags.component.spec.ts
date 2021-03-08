import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawingTagsComponent } from './drawing-tags.component';

describe('DrawingTagsComponent', () => {
  let component: DrawingTagsComponent;
  let fixture: ComponentFixture<DrawingTagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawingTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
