import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; //BrowserAnimationsModule
import { CarrouselService } from '@app/services/carrousel/carrousel.service';
import { Drawing } from '@common/communication/drawing';
import { DrawingData } from '@common/communication/drawing-data';
import { Tag } from '@common/communication/tag';
import { of } from 'rxjs';
import { DrawingTagsComponent } from './drawing-tags.component';

describe('DrawingTagsComponent', () => {
  let component: DrawingTagsComponent;
  let fixture: ComponentFixture<DrawingTagsComponent>;
  let carrouselService: CarrouselService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatChipsModule, NoopAnimationsModule, HttpClientTestingModule, MatFormFieldModule],
      declarations: [ DrawingTagsComponent ], 
      providers: [CarrouselService, HttpTestingController]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingTagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //loader = TestbedHarnessEnvironment.loader(fixture);

    carrouselService = TestBed.inject(CarrouselService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get all drawings', async(() => {
    const drawings: Drawing[] = [];
    spyOn(carrouselService, 'getAllDrawings').and.returnValue(of(drawings));
    component.getAllDrawings();
    expect(component.drawings).toEqual(drawings);
  }));

  it('should get filtered drawings', async() => {
    const drawings: Drawing[] = [];
    spyOn(carrouselService, 'getFilteredDrawings').and.returnValue(of(drawings));
    component.getFilteredDrawings();
    expect(component.drawings).toEqual(drawings);
  });

  it('should add a filter', () => {
    const inputValue = {value: 'filter'} as HTMLInputElement;
    const spy = spyOn(component, 'getFilteredDrawings');
    component.addFilter({input: inputValue, value: 'filter'} as MatChipInputEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('should not add an empty filter', () => {
    const inputValue = {value: ' '} as HTMLInputElement;
    component.addFilter({input: inputValue, value: ' '} as MatChipInputEvent);
    expect(component.filterTags.length).toEqual(0);
  });

  it('should remove a tag', () => {
    const inputValue = {value: 'filter'} as HTMLInputElement;
    component.addFilter({input: inputValue, value: 'filter'} as MatChipInputEvent);
    expect(component.filterTags.length).toEqual(1);
    component.remove(component.filterTags[0]);
    expect(component.filterTags.length).toEqual(0);
  });

  it('should not remove a tag', () => {
    const inputValue = {value: 'filter'} as HTMLInputElement;
    component.addFilter({input: inputValue, value: 'filter'} as MatChipInputEvent);
    component.remove({name: 'filter'} as Tag);
    expect(component.filterTags.length).toEqual(1);
  });

  it('should get filtered drawings', () => {
    const drawing = new Drawing(new DrawingData(''));
    spyOn(carrouselService, 'getFilteredDrawings').and.returnValue(of([drawing]));
    component.getFilteredDrawings();
    expect(component.drawings.length).toEqual(1);
  });
});
