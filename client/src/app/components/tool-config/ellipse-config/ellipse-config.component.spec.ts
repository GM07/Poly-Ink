import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
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
import { Mode } from '@app/services/tools/abstract-shape.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { EllipseConfigComponent } from './ellipse-config.component';

describe('EllipseConfigComponent', () => {
    let component: EllipseConfigComponent;
    let fixture: ComponentFixture<EllipseConfigComponent>;
    let loader: HarnessLoader;
    let buttonToggleLabelElements: HTMLLabelElement[];
    let ellipseService: EllipseService;

    const DEFAULT_VALUE = 1;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [EllipseConfigComponent],
            imports: [MatDividerModule, MatSliderModule, NoopAnimationsModule, FormsModule, MatButtonToggleModule],
        }).compileComponents();
        fixture = TestBed.createComponent(EllipseConfigComponent);
        fixture.detectChanges();
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        buttonToggleLabelElements = fixture.debugElement.queryAll(By.css('button')).map((debugEl) => debugEl.nativeElement);
        ellipseService = TestBed.inject(EllipseService);
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

    it('should load all button toggle group harnesses', async () => {
        const buttons = await loader.getAllHarnesses(MatButtonToggleGroupHarness);
        expect(buttons.length).toBe(1);
    });

    it('should load the toggles inside the group', async () => {
        const nToggles = 3;
        const group = await loader.getHarness(MatButtonToggleGroupHarness);
        const toggles = await group.getToggles();
        expect(toggles.length).toBe(nToggles);
    });

    it('should get first button in group as button with Contour text', async () => {
        const group = await loader.getHarness(MatButtonToggleGroupHarness);
        const toggles = await group.getToggles();
        expect(await toggles[0].getText()).toBe('Contour');
    });

    it('should get second button in group as button with Plein text', async () => {
        const group = await loader.getHarness(MatButtonToggleGroupHarness);
        const toggles = await group.getToggles();
        expect(await toggles[1].getText()).toBe('Plein');
    });

    it('should get third button in group as button with Plein & Contour text', async () => {
        const group = await loader.getHarness(MatButtonToggleGroupHarness);
        const toggles = await group.getToggles();
        expect(await toggles[2].getText()).toBe('Plein & Contour');
    });

    it('traceType should be Contour when Contour button is clicked ', async () => {
        buttonToggleLabelElements[0].click(); // Element 0 is Contour button
        expect(ellipseService.mode).toEqual(Mode.Contour);
    });

    it('traceType should be Plein when Plein button is clicked ', async () => {
        buttonToggleLabelElements[1].click(); // Element 1 is filled button
        expect(ellipseService.mode).toEqual(Mode.Filled);
    });

    it('traceType should be Plein & Contour when Plein & Contour button is clicked ', async () => {
        buttonToggleLabelElements[2].click(); // Element 2 is FilleWithContour button
        expect(ellipseService.mode).toEqual(Mode.FilledWithContour);
    });
});
