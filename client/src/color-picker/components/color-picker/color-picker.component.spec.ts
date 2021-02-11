import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from 'src/color-picker/classes/color';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from '../../services/color.service';
import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>;

    beforeEach(() => {
        const colorServiceStub = () => ({
            selectedColorFromHex: {},
            selectedColor: { r: {}, g: {}, b: {} },
            selectedAlpha: {},
            primaryColor: {},
            primaryColorAlpha: {},
            secondaryColor: {},
            secondaryColorAlpha: {},
        });
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [ColorPickerComponent],
            providers: [{ provide: ColorService, useFactory: colorServiceStub }],
        });
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it('should update selected color after hex change', () => {
        const color: Color = Colors.WHITE;
        component.hexValueChange(color);
        expect(component.colorService.selectedColorFromHex).toEqual(color);
    });

    it('should change R component after hex change', () => {
        component.colorService.selectedColor = Colors.BLACK;
        const hexValue: string = 'FF';
        const label: string = 'R';

        spyOn(component, 'hexValueChange').and.stub();

        component.hexRGBChange([label, hexValue]);
        expect(component.hexValueChange).toHaveBeenCalledWith(Colors.RED);
    });

    it('should change G component after hex change', () => {
        component.colorService.selectedColor = Colors.BLACK;
        const hexValue: string = 'FF';
        const label: string = 'G';

        spyOn(component, 'hexValueChange').and.stub();

        component.hexRGBChange([label, hexValue]);
        expect(component.hexValueChange).toHaveBeenCalledWith(Colors.GREEN);
    });

    it('should change B component after hex change', () => {
        component.colorService.selectedColor = Colors.BLACK;
        const hexValue: string = 'FF';
        const label: string = 'B';

        spyOn(component, 'hexValueChange').and.stub();

        component.hexRGBChange([label, hexValue]);
        expect(component.hexValueChange).toHaveBeenCalledWith(Colors.BLUE);
    });

    it('should not change selected color after change from invalid label', () => {
        component.colorService.selectedColor = Colors.BLACK;
        const hexValue: string = 'FF';
        const label: string = 'INVALID';

        spyOn(component, 'hexValueChange').and.stub();

        component.hexRGBChange([label, hexValue]);
        expect(component.hexValueChange).toHaveBeenCalledWith(component.colorService.selectedColor);
    });

    it('should change alpha on change from valid label', () => {
        component.colorService.selectedAlpha = 0;
        const alpha: number = 1;
        const label: string = 'Alpha';

        component.valueChange([label, alpha]);

        expect(component.colorService.selectedAlpha).toEqual(alpha);
    });

    it('should not change alpha on change from invalid label', () => {
        const alpha: number = 0;
        const label: string = 'INVALID';

        component.colorService.selectedAlpha = alpha;

        component.valueChange([label, alpha]);

        expect(component.colorService.selectedAlpha).toEqual(alpha);
    });

    it('should set primary color and alpha when chosen', () => {
        const color: Color = Colors.CYAN;
        const alpha: number = 0.5;
        spyOn(component, 'closeColorPicker').and.stub();

        component.colorService.selectedColor = color;
        component.colorService.selectedAlpha = alpha;

        component.chosePrimary();

        expect(component.colorService.primaryColor).toEqual(color);
        expect(component.colorService.primaryColorAlpha).toEqual(alpha);
    });

    it('should set secondary color and alpha when chosen', () => {
        const color: Color = Colors.CYAN;
        const alpha: number = 0.5;
        spyOn(component, 'closeColorPicker').and.stub();

        component.colorService.selectedColor = color;
        component.colorService.selectedAlpha = alpha;

        component.choseSecondary();

        expect(component.colorService.secondaryColor).toEqual(color);
        expect(component.colorService.secondaryColorAlpha).toEqual(alpha);
    });

    it('should emit close event on color selection or cancelation', () => {
        spyOn(component.closeMenuEvent, 'emit');
        component.chosePrimary();
        component.choseSecondary();
        component.closeColorPicker();
        expect(component.closeMenuEvent.emit).toHaveBeenCalledTimes(3);
    });
});
