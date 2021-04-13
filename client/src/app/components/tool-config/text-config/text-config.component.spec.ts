import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSliderHarness } from '@angular/material/slider/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TextService } from '@app/services/tools/text.service';
import { TextConfigComponent } from './text-config.component';

describe('TextConfigComponent', () => {
    let component: TextConfigComponent;
    let fixture: ComponentFixture<TextConfigComponent>;
    let loader: HarnessLoader;
    let textService: TextService;
    const DEFAULT_VALUE = 14;
    const MAX_FONT_SIZE = 100;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TextConfigComponent],
            imports: [MatSliderModule, NoopAnimationsModule, MatButtonToggleModule, MatSelectModule, FormsModule],
        }).compileComponents();

        textService = TestBed.inject(TextService);
        fixture = TestBed.createComponent(TextConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        loader = TestbedHarnessEnvironment.loader(fixture);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TextConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

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
        expect(await slider.getMaxValue()).toBe(MAX_FONT_SIZE);
    });

    it('should toggle italic attribute', () => {
        textService.config.italic = false;
        spyOn(textService, 'drawPreview');
        component.toggleItalic();
        expect(textService.config.italic).toBe(true);
    });

    it('should toggle bold attribute', () => {
        textService.config.bold = false;
        spyOn(textService, 'drawPreview');
        component.toggleBold();
        expect(textService.config.bold).toBe(true);
    });

    it('should change font attribute and be Arial by default', () => {
        expect(textService.config.textFont).toBe('Arial');
        spyOn(textService, 'drawPreview');
        component.changeFont('Times New Roman');
        expect(textService.config.textFont).toBe('Times New Roman');
    });

    it('should change font size and be 14 by default', () => {
        const newFontSize = 33;
        expect(textService.config.fontSize).toBe(DEFAULT_VALUE);
        spyOn(textService, 'drawPreview');
        component.changeFontSize(newFontSize);
        expect(textService.config.fontSize).toBe(newFontSize);
    });

    it('should change text alignment and be left by default', () => {
        expect(textService.config.alignmentSetting).toBe('left');
        spyOn(textService, 'drawPreview');
        component.setAlignment('right');
        expect(textService.config.alignmentSetting).toBe('right');
        component.setAlignment('right');
        expect(textService.config.alignmentSetting).toBe('right');
    });
});
