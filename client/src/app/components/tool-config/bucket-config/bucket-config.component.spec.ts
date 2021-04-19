import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderChange, MatSliderModule } from '@angular/material/slider';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { BucketConfigComponent } from './bucket-config.component';

describe('BucketConfigComponent', () => {
    let component: BucketConfigComponent;
    let fixture: ComponentFixture<BucketConfigComponent>;
    let loader: HarnessLoader;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BucketConfigComponent],
            imports: [MatDividerModule, MatSliderModule, FormsModule, NoopAnimationsModule],
        }).compileComponents();
        fixture = TestBed.createComponent(BucketConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load all slider harnesses', async () => {
        const nSliders = 1;
        const sliders = await loader.getAllHarnesses(MatSliderHarness);
        expect(sliders.length).toBe(nSliders);
    });

    it('should get default value of transparancy slider', async () => {
        const slider = await loader.getAllHarnesses(MatSliderHarness);
        expect(await slider[0].getValue()).toBe(ToolSettingsConst.BUCKET_DEFAULT_TOLERANCE);
    });

    it('should get max value of transparancy slider', async () => {
        const slider = await loader.getAllHarnesses(MatSliderHarness);
        expect(await slider[0].getMaxValue()).toBe(ToolSettingsConst.BUCKET_MAX_TOLERANCE);
    });

    it('should get min value of transparancy slider', async () => {
        const slider = await loader.getAllHarnesses(MatSliderHarness);
        expect(await slider[0].getMinValue()).toBe(ToolSettingsConst.BUCKET_MIN_TOLERANCE);
    });

    it('should be able to set value of area slider', async () => {
        const setValue = 33;
        const slider = await loader.getAllHarnesses(MatSliderHarness);
        expect(await slider[0].getValue()).toBe(ToolSettingsConst.BUCKET_DEFAULT_TOLERANCE);

        await slider[0].setValue(setValue);

        expect(await slider[0].getValue()).toBe(setValue);
    });

    it('should change tolerance on slider change', () => {
        component.bucketService.config.tolerance = 1;
        component.changeTolerance({ value: 2 } as MatSliderChange);
        expect(component.bucketService.config.tolerance).toBe(2);
    });
});
