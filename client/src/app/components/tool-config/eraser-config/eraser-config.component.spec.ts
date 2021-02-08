import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EraserConfigComponent } from './eraser-config.component';

describe('EraserConfigComponent', () => {
    let component: EraserConfigComponent;
    let fixture: ComponentFixture<EraserConfigComponent>;
    let loader: HarnessLoader;
    const DEFAULT_VALUE = 25;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EraserConfigComponent],
            imports: [MatDividerModule, MatSliderModule, NoopAnimationsModule, FormsModule, MatInputModule],
        }).compileComponents();
        fixture = TestBed.createComponent(EraserConfigComponent);
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
        const max = 100;
        const slider = await loader.getHarness(MatSliderHarness);
        expect(await slider.getMaxValue()).toBe(max);
    });

    it('should be able to set value of slider', async () => {
        const setValue = 54;
        const slider = await loader.getHarness(MatSliderHarness);
        expect(await slider.getValue()).toBe(DEFAULT_VALUE);

        await slider.setValue(setValue);

        expect(await slider.getValue()).toBe(setValue);
    });
});
