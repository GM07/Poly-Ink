/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from 'src/color-picker/classes/color';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { ColorIconComponent } from './color-icon.component';

describe('ColorIconComponent', () => {
    let component: ColorIconComponent;
    let fixture: ComponentFixture<ColorIconComponent>;
    let colorService: ColorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorIconComponent],
        }).compileComponents();
        colorService = TestBed.inject(ColorService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorIconComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init primary color to prper value', () => {
        const rgba = 'rgba(255, 0, 0, 1)';
        const primaryColorSpy = spyOnProperty(colorService, 'primaryColor', 'get').and.returnValue(Colors.RED);
        spyOn(colorService, 'rgba').and.returnValue(rgba);
        component.initValues();
        expect(primaryColorSpy).toHaveBeenCalled();
        expect(colorService.rgba).toHaveBeenCalledWith(Colors.RED, 1);
        expect(component.primaryColor).toEqual(rgba);
    });

    it('should init secondary color to prper value', () => {
        const rgba = 'rgba(255, 0, 0, 1)';
        const secondaryColorSpy = spyOnProperty(colorService, 'secondaryColor', 'get').and.returnValue(Colors.RED);
        spyOn(colorService, 'rgba').and.returnValue(rgba);
        component.initValues();
        expect(secondaryColorSpy).toHaveBeenCalled();
        expect(colorService.rgba).toHaveBeenCalledWith(Colors.RED, 1);
        expect(component.secondaryColor).toEqual(rgba);
    });

    it('should update primary color on change', () => {
        const color: Color = Colors.RED;
        const rgba = 'rgba(255, 0, 0, 1)';
        spyOn(colorService, 'rgba').and.returnValue(rgba);
        colorService.primaryColorChange.next(color);
        expect(colorService.rgba).toHaveBeenCalledWith(color, 1);
        expect(component.primaryColor).toEqual(rgba);
    });

    it('should update secondary color on change', () => {
        const color: Color = Colors.RED;
        const rgba = 'rgba(255, 0, 0, 1)';
        spyOn(colorService, 'rgba').and.returnValue(rgba);
        colorService.secondaryColorChange.next(color);
        expect(colorService.rgba).toHaveBeenCalledWith(color, 1);
        expect(component.secondaryColor).toEqual(rgba);
    });

    it('should use service to swap colors', () => {
        spyOn(colorService, 'swap').and.stub();
        component.swap();
        expect(colorService.swap).toHaveBeenCalled();
    });
});
