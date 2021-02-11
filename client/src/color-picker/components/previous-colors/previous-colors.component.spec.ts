import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from 'src/color-picker/classes/color';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { PreviousColorsComponent } from './previous-colors.component';

describe('PreviousColorsComponent', () => {
    let component: PreviousColorsComponent;
    let fixture: ComponentFixture<PreviousColorsComponent>;

    beforeEach(() => {
        const colorServiceStub = () => ({ primaryColor: {}, secondaryColor: {} });
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [PreviousColorsComponent],
            providers: [{ provide: ColorService, useFactory: colorServiceStub }],
        });
        fixture = TestBed.createComponent(PreviousColorsComponent);
        component = fixture.componentInstance;
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it('should set primary color when selected', () => {
        const color: Color = Colors.BLUE;
        component.selectPrimaryColor(color);
        expect(component.colorService.secondaryColor).not.toEqual(color);
        expect(component.colorService.primaryColor).toEqual(color);
    });

    it('should set secondary color when selected', () => {
        const color: Color = Colors.RED;
        component.selectSecondaryColor(color);
        expect(component.colorService.secondaryColor).toEqual(color);
        expect(component.colorService.primaryColor).not.toEqual(color);
    });
});
