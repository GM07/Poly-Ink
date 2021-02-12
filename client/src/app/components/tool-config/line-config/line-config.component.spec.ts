import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
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
import { LineConfigComponent } from './line-config.component';

@Component({ selector: 'app-color-icon', template: '' })
class StubColorIconComponent {}

describe('LineConfigComponent', () => {
    let component: LineConfigComponent;
    let fixture: ComponentFixture<LineConfigComponent>;
    let loader: HarnessLoader;
    const buttonHarness = MatButtonHarness;
    const DEFAULT_VALUE = 12;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LineConfigComponent, StubColorIconComponent],
            imports: [MatDividerModule, MatSliderModule, NoopAnimationsModule, FormsModule, MatInputModule, MatButtonModule],
        }).compileComponents();
        fixture = TestBed.createComponent(LineConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load all slider harnesses', async () => {
        const sliders = await loader.getAllHarnesses(MatSliderHarness);
        expect(sliders.length).toBe(2);
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
        const setValue = 15;
        const slider = await loader.getHarness(MatSliderHarness);
        expect(await slider.getValue()).toBe(DEFAULT_VALUE);

        await slider.setValue(setValue);

        expect(await slider.getValue()).toBe(setValue);
    });

    it('withJunctionPoint should be true by default', () => {
        expect(component.withJunctionPoint).toBeTrue();
    });

    it('should load all button harnesses', async () => {
        const buttons = await loader.getAllHarnesses(MatButtonHarness);
        expect(buttons.length).toBe(2);
    });

    it('should load button with exact text', async () => {
        const buttons = await loader.getAllHarnesses(buttonHarness.with({ text: 'Sans jonction' }));
        expect(buttons.length).toBe(1);
        expect(await buttons[0].getText()).toBe('Sans jonction');
    });

    it('withJunctionPoint should be false when normal button is clicked ', async () => {
        const button = await loader.getHarness(buttonHarness.with({ text: 'Sans jonction' }));
        await button.click();
        expect(fixture.componentInstance.withJunctionPoint).toBe(false);
    });

    it('withJunctionPoint should be false when normal button is clicked ', async () => {
        const button = await loader.getHarness(buttonHarness.with({ text: 'Avec point' }));
        await button.click();
        expect(fixture.componentInstance.withJunctionPoint).toBe(true);
    });

    it('should call function toggleLineType() when button clicked', async(() => {
        spyOn(component, 'toggleLineType');

        const button = fixture.debugElement.nativeElement.querySelector('button');
        button.click();

        fixture.whenStable().then(() => {
            expect(component.toggleLineType).toHaveBeenCalled();
        });
    }));
});
