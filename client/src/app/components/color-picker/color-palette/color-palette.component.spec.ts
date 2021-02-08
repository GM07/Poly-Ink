import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '@app/components/color-picker/color';
import { ColorService } from '@app/components/color-picker/color.service';
import { Colors } from '@app/constants/colors';
import { ColorPaletteComponent } from './color-palette.component';

describe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;
    let colorService: ColorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorPaletteComponent],
        }).compileComponents();
        colorService = TestBed.inject(ColorService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPaletteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should init hue to primary color', () => {
        const color: Color = Colors.CYAN;
        const primaryColorSpy = spyOnProperty(colorService, 'primaryColor', 'get').and.returnValue(color);
        component.initValues();
        expect(primaryColorSpy).toHaveBeenCalled();
        expect(component.hue).toEqual(color);
    });

    it('should update hue when RGB sliders change', () => {
        const color: Color = Colors.CYAN;
        const hueSpy = spyOnProperty(component, 'hue', 'set').and.stub();
        colorService.selectedHueChangeSliders.next(color);
        expect(hueSpy).toHaveBeenCalledWith(color);
    });

    it('should update hue when color wheel changes', () => {
        const color: Color = Colors.CYAN;
        const hueSpy = spyOnProperty(component, 'hue', 'set').and.stub();
        colorService.selectedHueChangeWheel.next(color);
        expect(hueSpy).toHaveBeenCalledWith(color);
    });

    it('should change selected color on hue wheel change', () => {
        const color: Color = Colors.BLUE;
        spyOnProperty(component, 'hue', 'set').and.stub();
        const selectedColorPaletteSpy = spyOnProperty(colorService, 'selectedColorPalette', 'set').and.stub();
        spyOn(component, 'getColorAtPosition').and.returnValue(color);
        colorService.selectedHueChangeWheel.next(color);
        expect(selectedColorPaletteSpy).toHaveBeenCalledWith(color);
    });

    it('should update cursor position on selected color change', () => {
        const color: Color = Colors.PURPLE;
        spyOn(component, 'draw').and.stub();
        spyOn(component, 'setPositionToColor').and.stub();
        colorService.selectedColorChangeSliders.next(color);
        expect(component.setPositionToColor).toHaveBeenCalledWith(color);
        expect(component.draw).toHaveBeenCalled();
    });

    it('should set position to color with RED hue', () => {
        const width: number = component.canvas.nativeElement.width;
        component.setPositionToColor(Colors.RED);
        expect(component.selectedPosition).toEqual({ x: width, y: 0 });
    });

    it('should set position to color with GREEN hue', () => {
        const width: number = component.canvas.nativeElement.width;
        component.setPositionToColor(Colors.GREEN);
        expect(component.selectedPosition).toEqual({ x: width, y: 0 });
    });

    it('should set position to color with BLUE hue', () => {
        const width: number = component.canvas.nativeElement.width;
        component.setPositionToColor(Colors.BLUE);
        expect(component.selectedPosition).toEqual({ x: width, y: 0 });
    });

    it('should set position to color with YELLOW hue', () => {
        const width: number = component.canvas.nativeElement.width;
        component.setPositionToColor(Colors.YELLOW);
        expect(component.selectedPosition).toEqual({ x: width, y: 0 });
    });

    it('should select appropriate position for white color', () => {
        component.setPositionToColor(Colors.WHITE);
        expect(component.selectedPosition).toEqual({ x: 0, y: 0 });
    });

    it('should select appropriate position for black color', () => {
        const width: number = component.canvas.nativeElement.width;
        const height: number = component.canvas.nativeElement.height;
        component.setPositionToColor(Colors.BLACK);
        expect(component.selectedPosition).toEqual({ x: width, y: height });
    });

    it('should draw after hue is set', () => {
        const color: Color = Colors.BLUE;
        spyOn(component, 'draw').and.stub();
        component.hue = color;
        expect(component.hue).toEqual(color);
        expect(component.draw).toHaveBeenCalled();
    });

    it('should set mouse down to false on mouse up', () => {
        component.mouseDown = true;
        component.onMouseUp(new MouseEvent('mouseup'));
        expect(component.mouseDown).toBeFalse();
    });

    it('should change selected position on mouse down', () => {
        const x = 50;
        const y = 50;
        const event: MouseEvent = new MouseEvent('click', { clientX: x, clientY: y });
        component.mouseDown = false;
        component.selectedPosition = { x: 0, y: 0 };
        spyOn(component, 'changeSelectedPosition').and.stub();
        component.onMouseDown(event);
        expect(component.mouseDown).toBeTrue();
        expect(component.changeSelectedPosition).toHaveBeenCalledWith(x, y);
    });

    it('should not change selected position on mouse move if mouse is not down', () => {
        component.mouseDown = false;
        spyOn(component, 'changeSelectedPosition').and.stub();
        component.onMouseMove(new MouseEvent('mousemove'));
        expect(component.changeSelectedPosition).not.toHaveBeenCalled();
    });

    it('should change selected position on mouse move', () => {
        component.mouseDown = true;
        spyOn(component, 'changeSelectedPosition').and.stub();
        component.onMouseMove(new MouseEvent('mousemove'));
        expect(component.changeSelectedPosition).toHaveBeenCalled();
    });

    it('should update selected color on selected position change', () => {
        const position = { x: 50, y: 50 };
        const color: Color = Colors.GREEN;
        const selectedColorPaletteSpy = spyOnProperty(colorService, 'selectedColorPalette', 'set').and.stub();
        spyOn(component, 'getColorAtPosition').and.returnValue(color);
        component.changeSelectedPosition(position.x, position.y);
        expect(component.selectedPosition).toEqual(position);
        expect(selectedColorPaletteSpy).toHaveBeenCalledWith(color);
    });

    it('sould draw on selected position change', () => {
        spyOn(component, 'draw').and.stub();
        component.changeSelectedPosition(0, 0);
        expect(component.draw).toHaveBeenCalled();
    });

    it('should keep selection within canvas when to small', () => {
        const x = -1;
        const y = -1;
        const position = component.keepSelectionWithinBounds(x, y);
        expect(position).toEqual({ x: 0, y: 0 });
    });

    it('should keep selection within canvas when to big', () => {
        const width: number = component.canvas.nativeElement.width;
        const height: number = component.canvas.nativeElement.height;
        const position = component.keepSelectionWithinBounds(width + 1, height + 1);
        expect(position).toEqual({ x: width, y: height });
    });

    it('should not get context if already defined', () => {
        spyOn(component.canvas.nativeElement, 'getContext');
        component.getContext();
        expect(component.canvas.nativeElement.getContext).not.toHaveBeenCalled();
    });

    // TODO check that draw works properly
    // TODO check draw selection area works properly
    // TODO check draw selection is not called when no position
});
