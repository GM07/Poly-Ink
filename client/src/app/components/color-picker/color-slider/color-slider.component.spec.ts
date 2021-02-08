import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from '@app/components/color-picker/color';
import { ColorService } from '@app/components/color-picker/color.service';
import { Colors } from '@app/constants/colors';

import { ColorSliderComponent } from './color-slider.component';

describe('ColorSliderComponent', () => {
    let component: ColorSliderComponent;
    let fixture: ComponentFixture<ColorSliderComponent>;
    let colorService: ColorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorSliderComponent],
        }).compileComponents();

        colorService = TestBed.inject(ColorService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should select height on mouseDown', () => {
        const event = new MouseEvent('click');
        expect(component.mouseDown).toBeFalse();
        spyOn(component, 'changeSelectedHeight');
        component.onMouseDown(event);
        expect(component.mouseDown).toBeTrue();
        expect(component.changeSelectedHeight).toHaveBeenCalled();
    });

    it('should set height on selected height change', () => {
        const height = 50;
        component.changeSelectedHeight(height);
        expect(component.selectedHeight).toEqual(height);
    });

    it('should draw on selected height change', () => {
        spyOn(component, 'draw');
        component.changeSelectedHeight(0);
        expect(component.draw).toHaveBeenCalled();
    });

    it('should set hue on selected height change', () => {
        const color: Color = Colors.BLUE;
        const selectedHueWheelSpy = spyOnProperty(colorService, 'selectedHueWheel', 'set').and.stub();
        spyOn(component, 'getColor').and.returnValue(color);
        component.changeSelectedHeight(0);
        expect(selectedHueWheelSpy).toHaveBeenCalledWith(color);
    });

    it('should return proper hue according to selected height', () => {
        const height: number = component.canvas.nativeElement.height * component.BLUE_START;
        const expectedHue: Color = Colors.BLUE;
        const hue: Color = component.getColor(height);
        expect(hue).toEqual(expectedHue);
    });

    it('should update on hue change', () => {
        const color: Color = Colors.GREEN;
        spyOn(component, 'draw');
        spyOn(component, 'setPositionToHue');
        colorService.selectedHueChangeSliders.next(color);
        expect(component.draw).toHaveBeenCalled();
        expect(component.setPositionToHue).toHaveBeenCalledWith(color);
    });

    it('mouse move should not update without mouse down', () => {
        component.mouseDown = false;
        spyOn(component, 'changeSelectedHeight');
        component.onMouseMove(new MouseEvent('mousemove'));
        expect(component.changeSelectedHeight).not.toHaveBeenCalled();
    });

    it('mouse move should update when mouse down', () => {
        component.mouseDown = true;
        spyOn(component, 'changeSelectedHeight');
        component.onMouseMove(new MouseEvent('mousemove'));
        expect(component.changeSelectedHeight).toHaveBeenCalled();
    });

    it('should update mouseDown variable on mouse up', () => {
        component.mouseDown = true;
        component.onMouseUp(new MouseEvent('mouseup'));
        expect(component.mouseDown).toBeFalse();
    });

    it('should select good height for red hue', () => {
        component.setPositionToHue(Colors.RED);
        expect(component.selectedHeight).toEqual(component.RED_START);
    });

    it('should select good height for yellow hue', () => {
        const height = component.canvas.nativeElement.height * component.YELLOW_START;
        component.setPositionToHue(Colors.YELLOW);
        expect(component.selectedHeight).toEqual(height);
    });

    it('should select good height for green hue', () => {
        const height = component.canvas.nativeElement.height * component.GREEN_START;
        component.setPositionToHue(Colors.GREEN);
        expect(component.selectedHeight).toEqual(height);
    });

    it('should select good height for cyan hue', () => {
        const height = component.canvas.nativeElement.height * component.CYAN_START;
        component.setPositionToHue(Colors.CYAN);
        expect(component.selectedHeight).toEqual(height);
    });

    it('should select good height for blue hue', () => {
        const height = component.canvas.nativeElement.height * component.BLUE_START;
        component.setPositionToHue(Colors.BLUE);
        expect(component.selectedHeight).toEqual(height);
    });

    it('should select good height for purple hue', () => {
        const height = component.canvas.nativeElement.height * component.PURPLE_START;
        component.setPositionToHue(Colors.PURPLE);
        expect(component.selectedHeight).toEqual(height);
    });

    it('should set height as 0 for invalid hue', () => {
        component.setPositionToHue(Colors.GRAY);
        expect(component.selectedHeight).toEqual(0);
    });

    it('should not get context if already defined', () => {
        spyOn(component.canvas.nativeElement, 'getContext');
        component.getContext();
        expect(component.canvas.nativeElement.getContext).not.toHaveBeenCalled();
    });

    // TODO - Test if draw draws proper gradient
    // TODO - Test DrawSelectionBox
});
