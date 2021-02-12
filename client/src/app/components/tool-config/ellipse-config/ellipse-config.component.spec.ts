import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { EllipseMode } from '@app/services/tools/ellipse-service';
import { EllipseConfigComponent } from './ellipse-config.component';

describe('EllipseConfigComponent', () => {
    let component: EllipseConfigComponent;
    let fixture: ComponentFixture<EllipseConfigComponent>;
    let loader: HarnessLoader;
    const buttonHarness = MatButtonHarness;
    const DEFAULT_VALUE = 1;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EllipseConfigComponent],
            imports: [MatDividerModule, MatButtonModule, MatSliderModule, NoopAnimationsModule, MatInputModule, FormsModule],
        }).compileComponents();
        fixture = TestBed.createComponent(EllipseConfigComponent);
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
        expect(await slider.getMaxValue()).toBe(ToolSettingsConst.MAX_WIDTH);
    });

    it('should be able to set value of slider', async () => {
        const setValue = 49;
        const slider = await loader.getHarness(MatSliderHarness);
        expect(await slider.getValue()).toBe(DEFAULT_VALUE);

        await slider.setValue(setValue);
        expect(await slider.getValue()).toBe(setValue);
    });

    it('traceType should be Contour by default', () => {
        expect(component.traceTypeIn).toEqual(EllipseMode.Contour);
    });

    it('should load all button harnesses', async () => {
        const nButtons = 3;
        const buttons = await loader.getAllHarnesses(MatButtonHarness);
        expect(buttons.length).toBe(nButtons);
    });

    it('should load button with exact text', async () => {
        const buttons = await loader.getAllHarnesses(buttonHarness.with({ text: 'Contour' }));
        expect(buttons.length).toBe(1);
        expect(await buttons[0].getText()).toBe('Contour');
    });

    it('traceType should be Contour when Contour button is clicked ', async () => {
        const button1 = await loader.getHarness(buttonHarness.with({ text: 'Contour' }));
        await button1.click();
        expect(fixture.componentInstance.traceTypeIn).toEqual(EllipseMode.Contour);
    });

    it('traceType should be Plein when Plein button is clicked ', async () => {
        const button2 = await loader.getHarness(buttonHarness.with({ text: 'Plein' }));
        await button2.click();
        expect(fixture.componentInstance.traceTypeIn).toEqual(EllipseMode.Filled);
    });

    it('traceType should be Plein & Contour when Plein & Contour button is clicked ', async () => {
        const button3 = await loader.getHarness(buttonHarness.with({ text: 'Plein & Contour' }));
        await button3.click();
        expect(fixture.componentInstance.traceTypeIn).toEqual(EllipseMode.FilledWithContour);
    });
});
