import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PencilConfigComponent } from './pencil-config.component';

describe('PencilConfigComponent', () => {
    let component: PencilConfigComponent;
    let fixture: ComponentFixture<PencilConfigComponent>;
    let loader: HarnessLoader;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PencilConfigComponent],
            imports: [MatDividerModule, MatSliderModule, FormsModule, NoopAnimationsModule, MatInputModule],
        }).compileComponents();
        fixture = TestBed.createComponent(PencilConfigComponent);
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
        const defaultValue = 12;
        const slider = await loader.getHarness(MatSliderHarness);
        expect(await slider.getValue()).toBe(defaultValue);
    });

    it('should get max value of slider', async () => {
        const max = 100;
        const slider = await loader.getHarness(MatSliderHarness);
        expect(await slider.getMaxValue()).toBe(max);
    });

    it('should be able to set value of slider', async () => {
        const defaultValue = 12;
        const setValue = 33;
        const slider = await loader.getHarness(MatSliderHarness);
        expect(await slider.getValue()).toBe(defaultValue);

        await slider.setValue(setValue);

        expect(await slider.getValue()).toBe(setValue);
    });
});
