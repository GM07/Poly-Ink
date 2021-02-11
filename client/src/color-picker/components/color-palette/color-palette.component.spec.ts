import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorService } from 'src/color-picker/services/color.service';
import { ColorPaletteComponent } from './color-palette.component';

describe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;
    let colorService: ColorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPaletteComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPaletteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        colorService = TestBed.inject(ColorService);
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it(`mouseDown has default value`, () => {
        expect(component.mouseDown).toEqual(false);
    });
});
