/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from '@app/components/color-picker/color.service';

import { Color } from '@app/components/color-picker/color';
import { Colors } from '@app/constants/colors';
import { ColorPreviewComponent } from './color-preview.component';

describe('ColorPreviewComponent', () => {
    let component: ColorPreviewComponent;
    let fixture: ComponentFixture<ColorPreviewComponent>;
    let colorService: ColorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPreviewComponent],
        }).compileComponents();

        colorService = TestBed.inject(ColorService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init preview colors', () => {
        const rgbaString = 'rgba(0, 255, 0, 1)';
        const primaryColorSpy = spyOnProperty(colorService, 'primaryColor', 'get').and.returnValue(Colors.RED);
        const primaryColorAlphaSpy = spyOnProperty(colorService, 'primaryColorAlpha', 'get').and.returnValue(1);
        spyOn(colorService, 'rgba').and.returnValue(rgbaString);
        component.initValues();
        expect(primaryColorSpy).toHaveBeenCalled();
        expect(primaryColorAlphaSpy).toHaveBeenCalled();
        expect(colorService.rgba).toHaveBeenCalledWith(Colors.RED, 1);
        expect(component.previewColor).toEqual(rgbaString);
    });

    it('should update preview colors on change', () => {
        const color: Color = Colors.GREEN;
        const rgbaString = 'rgba(0, 255, 0, 1)';
        spyOn(colorService, 'rgba').and.returnValue(rgbaString);
        colorService.selectedColorChange.next(color);
        expect(colorService.rgba).toHaveBeenCalledWith(color, 1);
        expect(component.previewColor).toEqual(rgbaString);
    });
});
