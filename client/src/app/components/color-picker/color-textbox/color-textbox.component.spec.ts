import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Colors } from '@app/constants/colors';
import { HexColors } from '@app/constants/hex-colors';
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

    it('should accept valid hex', () => {
        const validHex = 'AFAFAF';
        const cleanHex: string = component.cleanHex(validHex);
        expect(cleanHex).toEqual(validHex);
    });

    it('should accept upper and lowercase', () => {
        const validHex = 'AfAfAf';
        const cleanHex: string = component.cleanHex(validHex);
        expect(cleanHex).toEqual(validHex);
    });

    it('should accept hex preceded by #', () => {
        const validHex = '#AFAFAF';
        const cleanHex: string = component.cleanHex(validHex);
        expect(cleanHex).toEqual(validHex.substr(1));
    });

    it('should refuse hex too short', () => {
        const invalidHex = 'AFFAF';
        const cleanHex: string = component.cleanHex(invalidHex);
        expect(cleanHex).toEqual(HexColors.INVALID);
    });

    it('should refuse hex too long', () => {
        const invalidHex = 'AFAFAFA';
        const cleanHex: string = component.cleanHex(invalidHex);
        expect(cleanHex).toEqual(HexColors.INVALID);
    });

    it('should refuse invalid hex', () => {
        const invalidHex = 'Afga1a';
        const cleanHex: string = component.cleanHex(invalidHex);
        expect(cleanHex).toEqual(HexColors.INVALID);
    });

    it('should emit color change', () => {
        spyOn(component.hexChangeEvent, 'emit');
        component.onChange(HexColors.RED);
        expect(component.hexChangeEvent.emit).toHaveBeenCalledWith(Colors.RED);
    });
});
