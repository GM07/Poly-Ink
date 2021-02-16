import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonToggleGroupHarness } from '@angular/material/button-toggle/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { LineService } from '@app/services/tools/line.service';
import { LineConfigComponent } from './line-config.component';

@Component({ selector: 'app-color-config', template: '' })
class StubColorConfigComponent {}

describe('LineConfigComponent', () => {
    let component: LineConfigComponent;
    let fixture: ComponentFixture<LineConfigComponent>;
    let loader: HarnessLoader;
    let buttonToggleLabelElements: HTMLLabelElement[];
    let lineService: LineService;

    const DEFAULT_VALUE = 6;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [LineConfigComponent, StubColorConfigComponent],
            imports: [MatDividerModule, MatSliderModule, NoopAnimationsModule, FormsModule, MatButtonToggleModule],
        }).compileComponents();
        fixture = TestBed.createComponent(LineConfigComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        buttonToggleLabelElements = fixture.debugElement.queryAll(By.css('button')).map((debugEl) => debugEl.nativeElement);
        lineService = TestBed.inject(LineService);
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

    it('should load all button toggle group harnesses', async () => {
        const buttons = await loader.getAllHarnesses(MatButtonToggleGroupHarness);
        expect(buttons.length).toBe(1);
    });

    it('should load the toggles inside the group', async () => {
        const group = await loader.getHarness(MatButtonToggleGroupHarness);
        const toggles = await group.getToggles();
        expect(toggles.length).toBe(2);
    });

    it('should get first button in group as button with Sans jonction text', async () => {
        const group = await loader.getHarness(MatButtonToggleGroupHarness);
        const toggles = await group.getToggles();
        expect(await toggles[0].getText()).toBe('Sans jonction');
    });

    it('should get second button in group as button with Avec point text', async () => {
        const group = await loader.getHarness(MatButtonToggleGroupHarness);
        const toggles = await group.getToggles();
        expect(await toggles[1].getText()).toBe('Avec point');
    });

    it('withJunctionPoint should be false when Sans jonction button is clicked ', async () => {
        buttonToggleLabelElements[0].click();
        fixture.detectChanges();
        expect(lineService.showJunctionPoints).toEqual(false);
    });

    it('withJunctionPoint should be true when Avec point button is clicked ', async () => {
        buttonToggleLabelElements[1].click();
        fixture.detectChanges();
        expect(lineService.showJunctionPoints).toEqual(true);
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
