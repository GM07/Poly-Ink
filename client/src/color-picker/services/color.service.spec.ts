import { inject, TestBed } from '@angular/core/testing';
import { Colors } from 'src/color-picker/constants/colors';
import { Color } from '../classes/color';
import { ColorService } from './color.service';

describe('Service: Color', () => {
    let service: ColorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ColorService],
        });
        service = TestBed.inject(ColorService);
    });

    it('should create ColorService', inject([ColorService], (colorService: ColorService) => {
        expect(colorService).toBeTruthy();
    }));

    it('should clone color before assigning it to primary color', () => {
        const color: Color = Colors.RED;
        service.primaryColor = color;
        expect(service.primaryColor).not.toBe(color);
    });

    it('should update previous colors on primary color change', () => {
        const color: Color = Colors.RED;
        spyOn(service, 'addToPreviousColors').and.stub();
        service.primaryColor = color;
        expect(service.addToPreviousColors).toHaveBeenCalledWith(color);
    });

    it('should notify subscriber on primary color change', () => {
        const color: Color = Colors.RED;
        spyOn(service.primaryColorChange, 'next').and.stub();
        service.primaryColor = color;
        expect(service.primaryColorChange.next).toHaveBeenCalledWith(color);
    });

    it('should clone color before assigning it to secondary color', () => {
        const color: Color = Colors.RED;
        service.secondaryColor = color;
        expect(service.secondaryColor).not.toBe(color);
    });

    it('should update previous colors on secondary color change', () => {
        const color: Color = Colors.RED;
        spyOn(service, 'addToPreviousColors').and.stub();
        service.secondaryColor = color;
        expect(service.addToPreviousColors).toHaveBeenCalledWith(color);
    });

    it('should get and set proper selected hue', () => {
        const color: Color = Colors.RED;
        service.selectedHue = color;
        expect(service.selectedHue).toEqual(color);
    });

    it('should get and set proper selected color', () => {
        const color: Color = Colors.RED;
        service.selectedColor = color;
        expect(service.selectedColor).toEqual(color);
    });

    it('should notify subscriber on secondary color change', () => {
        const color: Color = Colors.RED;
        spyOn(service.secondaryColorChange, 'next').and.stub();
        service.secondaryColor = color;
        expect(service.secondaryColorChange.next).toHaveBeenCalledWith(color);
    });

    it('should notify on selected color change', () => {
        const color: Color = Colors.RED;
        spyOn(service.selectedColorChange, 'next').and.stub();
        service.selectedColor = color;
        expect(service.selectedColorChange.next).toHaveBeenCalledWith(color);
    });

    it('should notify and update on selected color change from palette', () => {
        const color: Color = Colors.RED;
        const selectedColorSpy = spyOnProperty(service, 'selectedColor', 'set').and.stub();
        spyOn(service.selectedColorChangePalette, 'next').and.stub();
        service.selectedColorPalette = color;
        expect(selectedColorSpy).toHaveBeenCalledWith(color);
        expect(service.selectedColorChangePalette.next).toHaveBeenCalledWith(color);
    });

    it('should notify and update on selected color change from sliders', () => {
        const color: Color = Colors.RED;
        const selectedColorSpy = spyOnProperty(service, 'selectedColor', 'set').and.stub();
        spyOn(service.selectedColorChangeSliders, 'next').and.stub();
        service.selectedColorSliders = color;
        expect(selectedColorSpy).toHaveBeenCalledWith(color);
        expect(service.selectedColorChangeSliders.next).toHaveBeenCalledWith(color);
    });

    it('should notify on hue color change', () => {
        const color: Color = Colors.YELLOW;
        spyOn(service.selectedHueChange, 'next').and.stub();
        service.selectedHue = color;
        expect(service.selectedHueChange.next).toHaveBeenCalledWith(color);
    });

    it('should notify on hue color change from sliders', () => {
        const color: Color = Colors.YELLOW;
        const selectedHueSpy = spyOnProperty(service, 'selectedHue', 'set').and.stub();
        spyOn(service.selectedHueChangeSliders, 'next').and.stub();
        service.selectedHueSliders = color;
        expect(selectedHueSpy).toHaveBeenCalledWith(color);
        expect(service.selectedHueChangeSliders.next).toHaveBeenCalledWith(color);
    });

    it('should notify on hue color change from wheel', () => {
        const color: Color = Colors.YELLOW;
        const selectedHueSpy = spyOnProperty(service, 'selectedHue', 'set').and.stub();
        spyOn(service.selectedHueChangeWheel, 'next').and.stub();
        service.selectedHueWheel = color;
        expect(selectedHueSpy).toHaveBeenCalledWith(color);
        expect(service.selectedHueChangeWheel.next).toHaveBeenCalledWith(color);
    });

    it('should notify on primary color alpha change', () => {
        const alpha = 0.5;
        spyOn(service.primaryColorAlphaChange, 'next').and.stub();
        service.primaryColorAlpha = alpha;
        expect(service.primaryColorAlphaChange.next).toHaveBeenCalledWith(alpha);
    });

    it('rgba should return proper rgba string', () => {
        const color: Color = Colors.CYAN;
        const alpha = 0.5;
        const rgba = 'rgba(0, 255, 255, 0.5)';
        expect(service.rgba(color, alpha)).toEqual(rgba);
    });

    it('addToPrevious colors should remove duplicate colors', () => {
        const color: Color = Colors.RED;
        spyOn(service, 'removeDuplicateColor').and.stub();
        service.addToPreviousColors(color);
        expect(service.removeDuplicateColor).toHaveBeenCalledWith(color);
    });

    it('should notify when adding new color to previous colors', () => {
        const color: Color = Colors.RED;
        spyOn(service.previousColorsChange, 'next').and.stub();
        service.addToPreviousColors(color);
        expect(service.previousColorsChange.next).toHaveBeenCalled();
    });

    it('should remove least used color to remain under the max previous color limit', () => {
        for (let i = 0; i < ColorService.MAX_NUMBER_PREVIOUS_COLORS + 1; i++) {
            const color: Color = new Color(i, i, i);
            service.addToPreviousColors(color);
        }

        expect(service.previousColors.length).toEqual(ColorService.MAX_NUMBER_PREVIOUS_COLORS);
    });

    it('should remove color if already present in previous colors', () => {
        const color: Color = Colors.BLUE;
        service.addToPreviousColors(color);
        const length = service.previousColors.length;
        service.removeDuplicateColor(color);
        expect(service.previousColors.length).toEqual(length - 1);
    });

    it('should swap primary and secondary colors on swap', () => {
        const primary: Color = Colors.RED;
        const secondary: Color = Colors.BLUE;
        spyOnProperty(service, 'primaryColor', 'get').and.returnValue(primary);
        const primaryColorSetSpy = spyOnProperty(service, 'primaryColor', 'set').and.stub();
        spyOnProperty(service, 'secondaryColor', 'get').and.returnValue(secondary);
        const secondaryColorSetSpy = spyOnProperty(service, 'secondaryColor', 'set').and.stub();
        service.swap();
        expect(primaryColorSetSpy).toHaveBeenCalledWith(secondary);
        expect(secondaryColorSetSpy).toHaveBeenCalledWith(primary);
    });

    it('should swap primary alpha and secondary alpha on swap', () => {
        const primaryAlpha = 0.6;
        const secondaryAlpha = 0.8;
        spyOnProperty(service, 'primaryColorAlpha', 'get').and.returnValue(primaryAlpha);
        const primaryAlphaSetSpy = spyOnProperty(service, 'primaryColorAlpha', 'set').and.stub();
        service.secondaryColorAlpha = secondaryAlpha;
        service.swap();
        expect(primaryAlphaSetSpy).toHaveBeenCalledWith(secondaryAlpha);
        expect(service.secondaryColorAlpha).toEqual(primaryAlpha);
    });
});
