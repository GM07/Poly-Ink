import { HarnessLoader } from '@angular/cdk/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
//import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { EllipseConfigComponent } from './ellipse-config.component';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { MatButtonHarness } from '@angular/material/button/testing';

describe('EllipseConfigComponent', () => {
    let component: EllipseConfigComponent;
    let fixture: ComponentFixture<EllipseConfigComponent>;
    let loader: HarnessLoader;
    let buttonHarness = MatButtonHarness;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EllipseConfigComponent],
            imports: [MatDividerModule, MatButtonModule, MatSliderModule, NoopAnimationsModule, MatInputModule, FormsModule]
        }).compileComponents();
        fixture = TestBed.createComponent(EllipseConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load all slider harnesses', async() => {
        const sliders = await loader.getAllHarnesses(MatSliderHarness);
        expect(sliders.length).toBe(1);
    });

    it ('should get max value of slider', async() => {
        const slider = await loader.getHarness(MatSliderHarness);
        expect(await slider.getMaxValue()).toBe(100);
    });

    it('should be able to set value of slider', async() => {
        const slider = await loader.getHarness(MatSliderHarness);
        expect(await slider.getValue()).toBe(1);

        await slider.setValue(78);
        expect(await slider.getValue()).toBe(78);
    });

    it('traceType should be Contour by default', () => {
        expect(component.traceType).toEqual('Contour');
    });

    it('should load all button harnesses', async () => {
        const buttons = await loader.getAllHarnesses(MatButtonHarness);
        expect(buttons.length).toBe(3);
      }
    );

    it('should load button with exact text', async () => {
        const buttons = await loader.getAllHarnesses(buttonHarness.with({text: 'Contour'}));
        expect(buttons.length).toBe(1);
        expect(await buttons[0].getText()).toBe('Contour');
    });

    it('traceType should be Contour when Contour button is clicked ', async () => {
        const button1 = await loader.getHarness(buttonHarness.with({text: 'Contour'}));
        await button1.click();
        expect(fixture.componentInstance.traceType).toEqual('Contour');
    });

    it('traceType should be Plein when Plein button is clicked ', async () => {
        const button2 = await loader.getHarness(buttonHarness.with({text: 'Plein'}));
        await button2.click();
        expect(fixture.componentInstance.traceType).toEqual('Plein');
    });

    it('traceType should be Plein&Contour when Plein&Contour button is clicked ', async () => {
        const button3 = await loader.getHarness(buttonHarness.with({text: 'Plein&Contour'}));
        await button3.click();
        expect(fixture.componentInstance.traceType).toEqual('Plein&Contour');
    });
});
