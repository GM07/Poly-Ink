import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Colors } from 'src/color-picker/constants/colors';
import { HexColors } from 'src/color-picker/constants/hex-colors';
import { ColorTextboxComponent } from './color-textbox.component';

describe('ColorTextboxComponent', () => {
    let component: ColorTextboxComponent;
    let fixture: ComponentFixture<ColorTextboxComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorTextboxComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorTextboxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit color change', () => {
        spyOn(component.hexColorChangeEvent, 'emit');
        component.onChange(HexColors.RED);
        expect(component.hexColorChangeEvent.emit).toHaveBeenCalledWith(Colors.RED);
    });
});
