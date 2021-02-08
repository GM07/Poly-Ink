import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '@app/components/color-picker/color';
import { ColorService } from '@app/components/color-picker/color.service';
import { Colors } from '@app/constants/colors';
import { PreviousColorsComponent } from './previous-colors.component';

describe('PreviousColorsComponent', () => {
    let component: PreviousColorsComponent;
    let fixture: ComponentFixture<PreviousColorsComponent>;
    let colorService: ColorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PreviousColorsComponent],
        }).compileComponents();
        colorService = TestBed.inject(ColorService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PreviousColorsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init previous colors', () => {
        const colors: Color[] = [Colors.WHITE, Colors.BLACK];
        const previousColorsSpy = spyOnProperty(colorService, 'previousColors', 'get').and.returnValue(colors);
        component.initValues();
        expect(previousColorsSpy).toHaveBeenCalled();
        expect(component.previousColors).toEqual(colors);
    });

    it('should select primary color', () => {
        const primaryColorSetSpy = spyOnProperty(colorService, 'primaryColor', 'set').and.stub();
        component.selectPrimaryColor(Colors.GRAY);
        expect(primaryColorSetSpy).toHaveBeenCalledWith(Colors.GRAY);
    });

    it('should select secondary color', () => {
        const secondaryColorSetSpy = spyOnProperty(colorService, 'secondaryColor', 'set').and.stub();
        component.selectSecondaryColor(Colors.GRAY);
        expect(secondaryColorSetSpy).toHaveBeenCalledWith(Colors.GRAY);
    });

    it('should update previous colors on change', () => {
        const colors: Color[] = [Colors.RED, Colors.BLUE, Colors.GREEN];
        colorService.previousColorsChange.next(colors);
        expect(component.previousColors).toEqual(colors);
    });
});
