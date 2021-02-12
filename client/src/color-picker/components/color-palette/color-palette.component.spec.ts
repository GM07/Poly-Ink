import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from 'src/color-picker/classes/color';
import { Colors } from 'src/color-picker/constants/colors';
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

    it('mouseDown has default value', () => {
        expect(component.mouseDown).toEqual(false);
    });

    it('should set position and draw on selected color change from hex', () => {
        const color: Color = Colors.RED;

        spyOn(component, 'setPositionToColor').and.stub();
        spyOn(component, 'draw').and.stub();

        colorService.selectedColorChangeFromHex.next(color);

        expect(component.setPositionToColor).toHaveBeenCalledWith(color);
        expect(component.draw).toHaveBeenCalled();
    });

    it('should draw and update color on hue change from slider', () => {
        const hue: Color = Colors.BLUE;

        spyOn(component, 'draw').and.stub();
        spyOn(component, 'getColorAtPosition').and.stub();

        colorService.hueChangeFromSlider.next(hue);

        expect(component.draw).toHaveBeenCalled();
        expect(component.getColorAtPosition).toHaveBeenCalled();
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

    it('should set mouse down to false on mouse up', () => {
        component.mouseDown = true;
        component.onMouseUp(new MouseEvent('mouseup'));
        expect(component.mouseDown).toBeFalse();
    });

    it('should change selected position on mouseDown', () => {
        const x = 50;
        const y = 50;

        spyOn(component, 'changeSelectedPosition').and.stub();

        component.onMouseDown(new MouseEvent('mouseDown', { clientX: x, clientY: y }));

        expect(component.mouseDown).toBeTrue();
        expect(component.changeSelectedPosition).toHaveBeenCalledWith(x, y);
    });

    it('should move selected position on mouse move if mouse is down', () => {
        const x = 50;
        const y = 50;
        component.mouseDown = true;

        spyOn(component, 'changeSelectedPosition').and.stub();

        component.onMouseMove(new MouseEvent('mousemove', { clientX: x, clientY: y }));

        expect(component.changeSelectedPosition).toHaveBeenCalledWith(x, y);
    });

    it('should not move selected position on mouse move if mouse up', () => {
        const x = 50;
        const y = 50;
        component.mouseDown = false;

        spyOn(component, 'changeSelectedPosition').and.stub();

        component.onMouseMove(new MouseEvent('mousemove', { clientX: x, clientY: y }));

        expect(component.changeSelectedPosition).not.toHaveBeenCalled();
    });

    it('should make appropriate calls when changing positions', () => {
        const x = 50;
        const y = 50;

        spyOn(component, 'draw').and.stub();
        spyOn(component, 'keepSelectionWithinBounds').and.returnValue({ x, y });
        spyOn(component, 'getColorAtPosition').and.stub();

        component.changeSelectedPosition(x, y);

        expect(component.keepSelectionWithinBounds).toHaveBeenCalledWith(x, y);
        expect(component.draw).toHaveBeenCalled();
        expect(component.getColorAtPosition).toHaveBeenCalledWith(x, y);
    });

    it('should keep selection within bounds', () => {
        const startX = 0;
        const startY = 0;
        const width: number = component.canvas.nativeElement.width;
        const height: number = component.canvas.nativeElement.height;
        const x = 50;
        const y = 50;

        let position: { x: number; y: number } = component.keepSelectionWithinBounds(width + 1, height + 1);
        expect(position).toEqual({ x: width, y: height });

        position = component.keepSelectionWithinBounds(startX - 1, startY - 1);
        expect(position).toEqual({ x: startX, y: startY });

        position = component.keepSelectionWithinBounds(x, y);
        expect(position).toEqual({ x, y });
    });

    it('should get proper color from canvas', () => {
        const width: number = component.canvas.nativeElement.width;
        const height: number = component.canvas.nativeElement.height;

        let color: Color = component.getColorAtPosition(width, height);

        color = component.getColorAtPosition(width, height);
        expect(color.r).toEqual(Colors.BLACK.r);
        expect(color.g).toEqual(Colors.BLACK.g);
        expect(color.b).toEqual(Colors.BLACK.b);
    });

    it('should not getContext if there', () => {
        // Get context to make sure we have one
        component.getContext();
        spyOn(component.canvas.nativeElement, 'getContext').and.stub();

        // Get context should not do anything since we already have it
        component.getContext();
        expect(component.canvas.nativeElement.getContext).not.toHaveBeenCalled();
    });

    it('should not draw selection on draw', () => {
        spyOn(component, 'drawSelectionArea').and.stub();
        component.draw();
        expect(component.drawSelectionArea).toHaveBeenCalled();
    });
});
