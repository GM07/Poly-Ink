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
import { RectangleConfigComponent } from './rectangle-config.component';

describe('RectangleConfigComponent', () => {
    let component: RectangleConfigComponent;
    let fixture: ComponentFixture<RectangleConfigComponent>;
    let loader: HarnessLoader;
    const buttonHarness = MatButtonHarness;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RectangleConfigComponent],
            imports: [MatDividerModule, MatButtonModule, MatSliderModule, FormsModule, MatInputModule, NoopAnimationsModule],
        }).compileComponents();
        fixture = TestBed.createComponent(RectangleConfigComponent);
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

    it('should get max value of slider', async () => {
        const max = 100;
        const slider = await loader.getHarness(MatSliderHarness);
        expect(await slider.getMaxValue()).toBe(max);
    });

    it('should be able to set value of slider', async () => {
        const setValue = 99;
        const slider = await loader.getHarness(MatSliderHarness);
        expect(await slider.getValue()).toBe(1);

        await slider.setValue(setValue);

        expect(await slider.getValue()).toBe(setValue);
    });

    it('traceType should be Contour by default', () => {
        expect(component.traceTypeTestIn).toEqual(0);
    });

    it('should load all button harnesses', async () => {
        const nButtons = 3;
        const buttons = await loader.getAllHarnesses(MatButtonHarness);
        expect(buttons.length).toBe(nButtons);
    });

    it('should load button with Contour text', async () => {
        const buttons = await loader.getAllHarnesses(buttonHarness.with({ text: 'Contour' }));
        expect(buttons.length).toBe(1);
        expect(await buttons[0].getText()).toBe('Contour');
    });

    it('should load button with Plein text', async () => {
        const buttons = await loader.getAllHarnesses(buttonHarness.with({ text: 'Plein' }));
        expect(buttons.length).toBe(1);
        expect(await buttons[0].getText()).toBe('Plein');
    });

    it('should load button with Plein&Contour text', async () => {
        const buttons = await loader.getAllHarnesses(buttonHarness.with({ text: 'Plein&Contour' }));
        expect(buttons.length).toBe(1);
        expect(await buttons[0].getText()).toBe('Plein&Contour');
    });

    it('traceType should be Contour when Contour button is clicked ', async () => {
        const button1 = await loader.getHarness(buttonHarness.with({ text: 'Contour' }));
        await button1.click();
        expect(fixture.componentInstance.traceTypeTestIn).toEqual(0);
    });

    it('traceType should be Plein when Plein button is clicked ', async () => {
        const button2 = await loader.getHarness(buttonHarness.with({ text: 'Plein' }));
        await button2.click();
        expect(fixture.componentInstance.traceTypeTestIn).toEqual(1);
    });

    it('traceType should be Plein&Contour when Plein&Contour button is clicked ', async () => {
        const button3 = await loader.getHarness(buttonHarness.with({ text: 'Plein&Contour' }));
        await button3.click();
        expect(fixture.componentInstance.traceTypeTestIn).toEqual(2);
    });
});