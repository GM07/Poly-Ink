import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuTrigger } from '@angular/material/menu';
import { Color } from 'src/color-picker/classes/color';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { ColorIconComponent } from './color-icon.component';

describe('ColorIconComponent', () => {
    let component: ColorIconComponent;
    let fixture: ComponentFixture<ColorIconComponent>;
    let newMatMenuTrigger: jasmine.SpyObj<MatMenuTrigger>;

    beforeEach(() => {
        newMatMenuTrigger = jasmine.createSpyObj('MatMenuTrigger', ['openMenu', 'closeMenu']);
        const colorServiceStub = () => ({
            swap: () => ({}),
            selectedColorFromHex: {},
            primaryColor: {},
        });
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [ColorIconComponent],
            providers: [{ provide: ColorService, useFactory: colorServiceStub }],
        });
        fixture = TestBed.createComponent(ColorIconComponent);
        component = fixture.componentInstance;
        component.colorMenuTrigger = newMatMenuTrigger;
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it('should swap colors on swap', () => {
        spyOn(component.colorService, 'swap').and.stub();
        component.swap();
        expect(component.colorService.swap).toHaveBeenCalled();
    });

    it('should open color picker menu', () => {
        const color: Color = Colors.PURPLE;
        component.colorService.primaryColor = color;
        component.colorService.primaryColorAlpha = 1;
        component.openColorPicker();
        expect(component.colorService.selectedColorFromHex).toEqual(color);
        expect(component.colorService.selectedAlpha).toEqual(1);
        expect(component.colorMenuTrigger.openMenu).toHaveBeenCalled();
    });

    it('should close color picker menu on close event', () => {
        component.closeMenu();
        expect(component.colorMenuTrigger.closeMenu).toHaveBeenCalled();
    });
});
