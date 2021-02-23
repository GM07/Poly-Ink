import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { AerosolConfigComponent } from './aerosol-config.component';

describe('AerosolConfigComponent', () => {
  let component: AerosolConfigComponent;
  let fixture: ComponentFixture<AerosolConfigComponent>;
  let loader: HarnessLoader;
  const DEFAULT_VALUE_AREA_SLIDER = 30;
  const DEFAULT_VALUE_DROPLETS_SLIDER = 0.5;
  const DEFAULT_VALUE_EMISSIONS_SLIDER = 100;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
          declarations: [AerosolConfigComponent],
          imports: [MatDividerModule, MatSliderModule, FormsModule, NoopAnimationsModule],
      }).compileComponents();
      fixture = TestBed.createComponent(AerosolConfigComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      loader = TestbedHarnessEnvironment.loader(fixture);
  }));

  it('should create', () => {
      expect(component).toBeTruthy();
  });

  it('should load all slider harnesses', async () => {
      const sliders = await loader.getAllHarnesses(MatSliderHarness);
      expect(sliders.length).toBe(3);
  });

  it('should get default value of area slider', async () => {
      const slider = await loader.getAllHarnesses(MatSliderHarness);
      expect(await slider[0].getValue()).toBe(DEFAULT_VALUE_AREA_SLIDER);
  });
  
  it('should get default value of droplets slider', async () => {
      const slider = await loader.getAllHarnesses(MatSliderHarness);
      expect(await slider[1].getValue()).toBe(DEFAULT_VALUE_DROPLETS_SLIDER);
  });

  it('should get default value of emissionsPerSecond slider', async () => {
    const slider = await loader.getAllHarnesses(MatSliderHarness);
    expect(await slider[2].getValue()).toBe(DEFAULT_VALUE_EMISSIONS_SLIDER);
  });

  it('should get max value of area slider', async () => {
      const slider = await loader.getAllHarnesses(MatSliderHarness);
      expect(await slider[0].getMaxValue()).toBe(ToolSettingsConst.MAX_WIDTH);
  });
  
  it('should get max value of droplets slider', async () => {
      const slider = await loader.getAllHarnesses(MatSliderHarness);
      expect(await slider[1].getMaxValue()).toBe(ToolSettingsConst.MAX_DROPLETS_WIDTH);
  });

  it('should get max value of emissions slider', async () => {
    const slider = await loader.getAllHarnesses(MatSliderHarness);
    expect(await slider[2].getMaxValue()).toBe(ToolSettingsConst.MAX_EMISSIONS_PER_SECOND);
  });

  it('should be able to set value of area slider', async () => {
      const setValue = 33;
      const slider = await loader.getAllHarnesses(MatSliderHarness);
      expect(await slider[0].getValue()).toBe(DEFAULT_VALUE_AREA_SLIDER);

      await slider[0].setValue(setValue);

      expect(await slider[0].getValue()).toBe(setValue);
  });

  it('should be able to set value of droplets slider', async () => {
      const setValue = 4.1;
      const slider = await loader.getAllHarnesses(MatSliderHarness);
      expect(await slider[1].getValue()).toBe(DEFAULT_VALUE_DROPLETS_SLIDER);

      await slider[1].setValue(setValue);

      expect(await slider[1].getValue()).toBe(setValue);
  });

  it('should be able to set value of emissions slider', async () => {
    const setValue = 98;
    const slider = await loader.getAllHarnesses(MatSliderHarness);
    expect(await slider[2].getValue()).toBe(DEFAULT_VALUE_EMISSIONS_SLIDER);

    await slider[2].setValue(setValue);

    expect(await slider[2].getValue()).toBe(setValue);
});
});
