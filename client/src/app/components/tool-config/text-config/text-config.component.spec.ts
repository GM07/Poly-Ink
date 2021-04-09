import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TextConfigComponent } from './text-config.component';


fdescribe('TextConfigComponent', () => {
  let component: TextConfigComponent;
  let fixture: ComponentFixture<TextConfigComponent>;
  //let loader: HarnessLoader;
  //let textService: TextService;
  //const DEFAULT_VALUE = 14;
  //const MAX_FONT_SIZE = 100;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextConfigComponent ],
      imports: [MatSliderModule, NoopAnimationsModule, MatButtonToggleModule, MatSelectModule, FormsModule],
    })
    .compileComponents();

    //textService = TestBed.inject(TextService);
    fixture = TestBed.createComponent(TextConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    //loader = TestbedHarnessEnvironment.loader(fixture);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
/*
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TextService } from '@app/services/tools/text.service';
import { TextConfigComponent } from './text-config.component';

describe('TextConfigComponent', () => {
  let component: TextConfigComponent;
  let fixture: ComponentFixture<TextConfigComponent>;
  let loader: HarnessLoader;
  let textService: TextService;
  const DEFAULT_VALUE = 14;
  const MAX_FONT_SIZE = 100;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextConfigComponent ],
      imports: [MatSliderModule, NoopAnimationsModule, MatButtonToggleModule, MatSelectModule, FormsModule],
    })
    .compileComponents();

    textService = TestBed.inject(TextService);
    fixture = TestBed.createComponent(TextConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load all slider harnesses', async () => {
    const sliders = await loader.getAllHarnesses(MatSliderHarness);
    expect(sliders.length).toBe(1);
  });

  it('should get default value of slider', async () => {
      const slider = await loader.getHarness(MatSliderHarness);
      expect(await slider.getValue()).toBe(DEFAULT_VALUE);
  });

  it('should get max value of slider', async () => {
      const slider = await loader.getHarness(MatSliderHarness);
      expect(await slider.getMaxValue()).toBe(MAX_FONT_SIZE);
  });

  it('should be able to set value of slider', async () => {
      const setValue = 33;
      const slider = await loader.getHarness(MatSliderHarness);
      expect(await slider.getValue()).toBe(DEFAULT_VALUE);

      await slider.setValue(setValue);

      expect(await slider.getValue()).toBe(setValue);
  });

  it('should call toggleItalic from textService', () => {
    let spy = spyOn<any>(textService, 'toggleItalic');
    component.toggleItalic();
    expect(spy).toHaveBeenCalled();
  });

  it('should call toggleBold from textService', () => {
    let spy = spyOn<any>(textService, 'toggleBold');
    component.toggleBold();
    expect(spy).toHaveBeenCalled();
  });

  it('should call changeFont from textService', () => {
    let spy = spyOn<any>(textService, 'changeFont');
    component.changeFont('Arial');
    expect(spy).toHaveBeenCalledWith('Arial');
  });

  it('should call changeFontSize from textService', () => {
    let spy = spyOn<any>(textService, 'changeFontSize');
    component.changeFontSize(20);
    expect(spy).toHaveBeenCalledWith(20);
  });

  it('should call changeTextAlign from textService', () => {
    let spy = spyOn<any>(textService, 'changeTextAlign');
    component.setAlignment('right');
    expect(spy).toHaveBeenCalledWith('right');
  });
});*/

