import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Colors } from '@app/constants/colors';
import { HexColors } from '@app/constants/hex-colors';
import { Color } from './color';
import { ColorPickerComponent } from './color-picker.component';
import { ColorService } from './color.service';

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;
    let colorService: ColorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPickerComponent],
        });
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
        colorService = TestBed.inject(ColorService);
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it('should init values', () => {
        const selectedColorSpy = spyOnProperty(colorService, 'primaryColor', 'get').and.returnValue(Colors.RED);
        const selectedAlphaSpy = spyOnProperty(colorService, 'primaryColorAlpha', 'get').and.stub();
        component.initValues();
        expect(selectedColorSpy).toHaveBeenCalled();
        expect(selectedAlphaSpy).toHaveBeenCalled();
    });

    it('should update on selected color change from palette', () => {
        const color: Color = Colors.RED;
        colorService.selectedColorChangePalette.next(color);
        expect(component.selectedColor).toEqual(Colors.RED);
        expect(component.hexColor).toEqual(HexColors.RED);
    });

    it('should update on primary color alpha change', () => {
        const alpha = 0.65;
        colorService.primaryColorAlphaChange.next(alpha);
        expect(component.selectedAlpha).toEqual(alpha);
    });

    it('should update selected color after change from hex textbox', () => {
        const color: Color = Colors.RED;
        const selectedColorPaletteSpy = spyOnProperty(colorService, 'selectedColorPalette', 'set').and.stub();
        const selectedColorSliderSpy = spyOnProperty(colorService, 'selectedColorSliders', 'set').and.stub();
        const selectedHueSliderSpy = spyOnProperty(colorService, 'selectedHueSliders', 'set').and.stub();
        component.hexValueChange(color);
        expect(selectedColorPaletteSpy).toHaveBeenCalledWith(color);
        expect(selectedColorSliderSpy).toHaveBeenCalledWith(color);
        expect(selectedHueSliderSpy).toHaveBeenCalledWith(color);
    });

    it('should detect value change from R slider', () => {
        spyOnProperty(colorService, 'selectedHueSliders', 'set').and.stub();
        spyOnProperty(colorService, 'selectedColorSliders', 'set').and.stub();
        const r = 50;
        const label = 'R';
        const value: [string, number] = [label, r];
        component.valueChange(value);
        expect(component.selectedColor.r).toEqual(r);
    });
    it('should detect value change from G slider', () => {
        spyOnProperty(colorService, 'selectedHueSliders', 'set').and.stub();
        spyOnProperty(colorService, 'selectedColorSliders', 'set').and.stub();
        const g = 50;
        const label = 'G';
        const value: [string, number] = [label, g];
        component.valueChange(value);
        expect(component.selectedColor.g).toEqual(g);
    });
    it('should detect value change from B slider', () => {
        spyOnProperty(colorService, 'selectedHueSliders', 'set').and.stub();
        spyOnProperty(colorService, 'selectedColorSliders', 'set').and.stub();
        const b = 50;
        const label = 'B';
        const value: [string, number] = [label, b];
        component.valueChange(value);
        expect(component.selectedColor.b).toEqual(b);
    });
    it('should detect value change from Alpha slider', () => {
        spyOnProperty(colorService, 'selectedHueSliders', 'set').and.stub();
        spyOnProperty(colorService, 'selectedColorSliders', 'set').and.stub();
        const alpha = 0.65;
        const label = 'Alpha';
        const value: [string, number] = [label, alpha];
        component.valueChange(value);
        expect(component.selectedAlpha).toEqual(alpha);
    });
    it('should notify service after slider value change', () => {
        const selectedHueSlidersSpy = spyOnProperty(colorService, 'selectedHueSliders', 'set').and.stub();
        const selectedColorSlidersSpy = spyOnProperty(colorService, 'selectedColorSliders', 'set').and.stub();
        component.valueChange(['test', 0]);
        expect(selectedColorSlidersSpy).toHaveBeenCalled();
        expect(selectedHueSlidersSpy).toHaveBeenCalled();
    });
    it('should notify service on choseColor action', () => {
        const primaryColorSpy = spyOnProperty(colorService, 'primaryColor', 'set').and.stub();
        const primaryColorAlphaSpy = spyOnProperty(colorService, 'primaryColorAlpha', 'set').and.stub();
        component.choseColor();
        expect(primaryColorSpy).toHaveBeenCalledWith(component.selectedColor);
        expect(primaryColorAlphaSpy).toHaveBeenCalledWith(component.selectedAlpha);
    });
});
