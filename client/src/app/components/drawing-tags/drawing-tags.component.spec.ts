import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
//import { platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations'; //BrowserAnimationsModule
import { CarrouselService } from '@app/services/carrousel/carrousel.service';
import { Drawing } from '@common/communication/drawing';
import { of } from 'rxjs';
import { DrawingTagsComponent } from './drawing-tags.component';

describe('DrawingTagsComponent', () => {
  let component: DrawingTagsComponent;
  let fixture: ComponentFixture<DrawingTagsComponent>;
  let carrouselService: CarrouselService;
  //let loader: HarnessLoader;
  /*
  beforeAll(() => {
    TestBed.initTestEnvironment(BrowserAnimationsModule, platformBrowserDynamicTesting());
  });*/

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

  /*
  it('should add a filter', async() => {
    const inChip: HTMLInputElement = new HTMLInputElement();
    let chip: MatChipInputEvent = {input: inChip, value: 'filter'};
    component.addFilter(chip);
    await loader.getHarness(MatChipHarness);
    expect(component.addFilter).toHaveBeenCalled();
  });*/

  /*
  it('should be able to trigger chip removal', async() => {
    //TODO add chips!!!
    let chipList = fixture.debugElement.query(By.directive(MatChipList))!.componentInstance;
    //let chipRemoveDebugElements = fixture.debugElement.queryAll(By.directive(MatChipRemove));
    let chips = chipList.chips;
    chips.toArray()[2].focus();

    // Destroy the third focused chip by dispatching a bubbling click event on the
    // associated chip remove element.
    let element = document.getElementById('remove');
    element?.click();
    //dispatchEvent(chipRemoveDebugElements[2].nativeElement, createMouseEvent('click'));
    //dispatchMouseEvent(chipRemoveDebugElements[2].nativeElement, 'click');
    fixture.detectChanges();

    expect(chips.toArray()[2].value).not.toBe(2, 'Expected the third chip to be removed.');
    expect(chipList._keyManager.activeItemIndex).toBe(2);
    //expect(fixture.componentInstance.remove).not.toHaveBeenCalled();
    //await chip.remove();
    //expect(fixture.componentInstance.remove).toHaveBeenCalled();
  });*/
});
