import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonToggleGroupHarness } from '@angular/material/button-toggle/testing';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToolSettingsConst } from '@app/constants/tool-settings';
import { PolygoneMode, PolygoneService } from '@app/services/tools/polygone.service';
import { PolygoneConfigComponent } from './polygone-config.component';

describe('PolygoneConfigComponent', () => {
    let component: PolygoneConfigComponent;
    let fixture: ComponentFixture<PolygoneConfigComponent>;
    let loader: HarnessLoader;
    let buttonToggleLabelElements: HTMLLabelElement[];
    let polygoneService: PolygoneService;
    let widthSliderHarness: MatSliderHarness;
    let numEdgesSliderHarness: MatSliderHarness;
    const NUM_SLIDERS = 2;
    const NUM_EDGES_SLIDER_ID = 'polygone-edges-slider';

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PolygoneConfigComponent],
            imports: [MatDividerModule, MatSliderModule, FormsModule, NoopAnimationsModule, MatButtonToggleModule],
        }).compileComponents();
        fixture = TestBed.createComponent(PolygoneConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
        buttonToggleLabelElements = fixture.debugElement.queryAll(By.css('button')).map((debugEl) => debugEl.nativeElement);
        polygoneService = TestBed.inject(PolygoneService);
        const sliders = await loader.getAllHarnesses(MatSliderHarness);
        for (const slider of sliders) {
            if ((await slider.getId()) === NUM_EDGES_SLIDER_ID) {
                numEdgesSliderHarness = slider;
            } else {
                widthSliderHarness = slider;
            }
        }
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle the traceType', () => {
        component.toggleTraceType(PolygoneMode.FilledWithContour);
        expect(polygoneService.polygoneMode).toBe(PolygoneMode.FilledWithContour);
    });

    it('should return the value and px string', () => {
        const pixelValue = 10;
        expect(component.colorSliderLabel(pixelValue)).toEqual('10px');
    });

    it('should load all slider harnesses', async () => {
        const sliders = await loader.getAllHarnesses(MatSliderHarness);
        expect(sliders.length).toBe(NUM_SLIDERS);
    });

    it('should have sliders with appropriate maximum values', async () => {
        expect(await numEdgesSliderHarness.getMaxValue()).toBe(ToolSettingsConst.MAX_NUM_EDGES);
        expect(await widthSliderHarness.getMaxValue()).toBe(ToolSettingsConst.MAX_WIDTH);
    });

    it('should have sliders with appropriate minimum values', async () => {
        expect(await numEdgesSliderHarness.getMinValue()).toBe(ToolSettingsConst.MIN_NUM_EDGES);
        expect(await widthSliderHarness.getMinValue()).toBe(ToolSettingsConst.MIN_WIDTH);
    });

    it('should be able to set inbounds the value of width slider', async () => {
        const testSetValue = 8;
        expect(await widthSliderHarness.getValue()).toBe(ToolSettingsConst.MIN_WIDTH);

        await widthSliderHarness.setValue(testSetValue);
        expect(await widthSliderHarness.getValue()).toBe(testSetValue);
    });

    it('should be able to set inbounds value for number of edges slider', async () => {
        const testSetValue = 10;
        expect(await numEdgesSliderHarness.getValue()).toBe(ToolSettingsConst.MIN_NUM_EDGES);

        await numEdgesSliderHarness.setValue(testSetValue);
        expect(await numEdgesSliderHarness.getValue()).toBe(testSetValue);
    });

    it('should prevent from setting an out of bounds value for number of edges slider', async () => {
        const testInvalidSetValue = 20;
        expect(await numEdgesSliderHarness.getValue()).toBe(ToolSettingsConst.MIN_NUM_EDGES);

        await numEdgesSliderHarness.setValue(testInvalidSetValue);
        expect(await numEdgesSliderHarness.getValue()).not.toBe(testInvalidSetValue);
    });

    it('should prevent from setting an out of bounds value for width slider', async () => {
        const testInvalidSetValue = -1;
        expect(await widthSliderHarness.getValue()).toBe(ToolSettingsConst.MIN_WIDTH);

        await widthSliderHarness.setValue(testInvalidSetValue);
        expect(await widthSliderHarness.getValue()).toBe(ToolSettingsConst.MIN_WIDTH);
    });

    it('should have a button toggle group', async () => {
        const buttonsGroup = await loader.getAllHarnesses(MatButtonToggleGroupHarness);
        expect(buttonsGroup.length).toBe(1);
    });

    it('should have the right amount of toggle buttons inside the first group', async () => {
        const nToggles = 3;
        const buttonsGroup = await loader.getHarness(MatButtonToggleGroupHarness);
        const toggles = await buttonsGroup.getToggles();
        expect(toggles.length).toBe(nToggles);
    });

    it('should have the first button in group as button with Contour text', async () => {
        const group = await loader.getHarness(MatButtonToggleGroupHarness);
        const toggles = await group.getToggles();
        expect(await toggles[0].getText()).toBe('Contour');
    });

    it('should have the second button in group as button with Plein text', async () => {
        const group = await loader.getHarness(MatButtonToggleGroupHarness);
        const toggles = await group.getToggles();
        expect(await toggles[1].getText()).toBe('Plein');
    });

    it('should have the third button in group as button with Plein & Contour text', async () => {
        const group = await loader.getHarness(MatButtonToggleGroupHarness);
        const toggles = await group.getToggles();
        expect(await toggles[2].getText()).toBe('Plein & Contour');
    });

    it('should set the traceType to Contour when Contour toggle button is clicked', async () => {
        buttonToggleLabelElements[0].click();
        fixture.detectChanges();
        expect(polygoneService.polygoneMode).toEqual(PolygoneMode.Contour);
    });

    it('should set the traceType to Plein when Plein toggle button is clicked', async () => {
        buttonToggleLabelElements[1].click();
        fixture.detectChanges();
        expect(polygoneService.polygoneMode).toEqual(PolygoneMode.Filled);
    });

    it('should set the traceType to Plein & Contour when Plein & Contour toggle button is clicked', async () => {
        buttonToggleLabelElements[2].click();
        fixture.detectChanges();
        expect(polygoneService.polygoneMode).toEqual(PolygoneMode.FilledWithContour);
    });
});
