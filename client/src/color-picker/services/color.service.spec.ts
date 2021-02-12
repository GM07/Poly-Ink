import { TestBed } from '@angular/core/testing';
import { Colors } from '../constants/colors';
import { Color } from './../classes/color';
import { ColorService } from './color.service';

describe('ColorService', () => {
    let service: ColorService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [ColorService] });
        service = TestBed.inject(ColorService);
    });

    it('can load instance', () => {
        expect(service).toBeTruthy();
    });

    it(`MAX_NUMBER_PREVIOUS_COLORS has default value`, () => {
        expect(ColorService.MAX_NUMBER_PREVIOUS_COLORS).toEqual(10);
    });

    it(`selectedColor has default value`, () => {
        expect(service.selectedColor).toEqual(Colors.BLACK);
    });

    it(`selectedAlpha has default value`, () => {
        expect(service.selectedAlpha).toEqual(1);
    });

    it(`selectedHue has default value`, () => {
        expect(service.selectedHue).toEqual(Colors.BLACK);
    });

    it(`primaryColorAlpha has default value`, () => {
        expect(service.primaryColorAlpha).toEqual(1);
    });

    it(`secondaryColorAlpha has default value`, () => {
        expect(service.secondaryColorAlpha).toEqual(1);
    });

    it('should return proper primary rgba string', () => {
        const redRgba: string = 'rgba(255, 0, 0, 1)';
        service.primaryColor = Colors.RED;
        expect(service.primaryRgba).toEqual(redRgba);
    });

    it('should return proper secondary rgba string', () => {
        const redRgba: string = 'rgba(255, 0, 0, 1)';
        service.secondaryColor = Colors.RED;
        expect(service.secondaryRgba).toEqual(redRgba);
    });

    it('should clone color before assigning it to primary color', () => {
        const color: Color = Colors.RED;
        spyOn(service, 'addToPreviousColors').and.stub();
        service.primaryColor = color;
        expect(service.primaryColor).not.toBe(color);
    });

    it('should update previous colors on primary color change', () => {
        const color: Color = Colors.RED;
        spyOn(service, 'addToPreviousColors').and.stub();
        service.primaryColor = color;
        expect(service.addToPreviousColors).toHaveBeenCalledWith(color);
    });

    it('should clone color before assigning it to secondary color', () => {
        const color: Color = Colors.RED;
        spyOn(service, 'addToPreviousColors').and.stub();
        service.secondaryColor = color;
        expect(service.secondaryColor).not.toBe(color);
    });

    it('should update previous colors on secondary color change', () => {
        const color: Color = Colors.RED;
        spyOn(service, 'addToPreviousColors').and.stub();
        service.secondaryColor = color;
        expect(service.addToPreviousColors).toHaveBeenCalledWith(color);
    });

    it('should make notify subscribers when setting hue from sliders', () => {
        const color: Color = Colors.RED;
        spyOn(service.hueChangeFromSlider, 'next').and.stub();
        service.selectedHueFromSliders = color;
        expect(service.hueChangeFromSlider.next).toHaveBeenCalledWith(color);
    });

    it('should be able to get previous colors', () => {
        const expectedPrevious: Color[] = [service.primaryColor, service.secondaryColor];
        expect(service.previousColors).toEqual(expectedPrevious);
    });

    it('should notify subscriptions when selecting colors from hex fields', () => {
        const color: Color = Colors.RED;
        spyOn(service.selectedColorChangeFromHex, 'next').and.stub();
        spyOn(service.hueChangeFromHex, 'next').and.stub();

        service.selectedColorFromHex = color;

        expect(service.selectedColorChangeFromHex.next).toHaveBeenCalledWith(color);
        expect(service.hueChangeFromHex.next).toHaveBeenCalledWith(color);
    });

    it('addToPrevious colors should call remove duplicate colors', () => {
        const color: Color = Colors.RED;
        spyOn(service, 'removeDuplicateColor').and.stub();
        service.addToPreviousColors(color);
        expect(service.removeDuplicateColor).toHaveBeenCalledWith(color);
    });

    it('should remove least used color to remain under the max previous color limit', () => {
        spyOn(service, 'removeDuplicateColor').and.stub();

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
        service.secondaryColorAlpha = secondaryAlpha;
        service.primaryColorAlpha = primaryAlpha;
        service.swap();
        expect(service.secondaryColorAlpha).toEqual(primaryAlpha);
        expect(service.primaryColorAlpha).toEqual(secondaryAlpha);
    });
});
