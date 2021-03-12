import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Color } from 'src/color-picker/classes/color';
import { Colors } from 'src/color-picker/constants/colors';
import { ColorService } from 'src/color-picker/services/color.service';
import { ColorSliderComponent } from './color-slider.component';

describe('ColorSliderComponent', () => {
    let component: ColorSliderComponent;
    let fixture: ComponentFixture<ColorSliderComponent>;
    let colorService: ColorService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorSliderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorSliderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        colorService = TestBed.inject(ColorService);
    });

    it('can load instance', () => {
        expect(component).toBeTruthy();
    });

    it('mouseDown has default value', () => {
        expect(component.leftMouseDown).toEqual(false);
    });

    it('selectedHeight has default value', () => {
        expect(component.selectedHeight).toEqual(0);
    });

    it('should make appropriate calls on hue change from hex', () => {
        const hue: Color = Colors.CYAN;
        spyOn(component, 'draw').and.stub();
        spyOn(component, 'setPositionToHue').and.stub();

        colorService.hueChangeFromHex.next(hue);

        expect(component.draw).toHaveBeenCalled();
        expect(component.setPositionToHue).toHaveBeenCalledWith(hue);
    });

    it('draw should make appropriate calls', () => {
        spyOn(component, 'drawSelectionBox').and.stub();
        component.draw();
        expect(component.drawSelectionBox).toHaveBeenCalled();
    });

    it('should select height on mouseDown', () => {
        const event = new MouseEvent('click');
        component.leftMouseDown = false;

        spyOn(component, 'changeSelectedHeight');
        component.onMouseDown(event);

        expect(component.leftMouseDown).toBeTrue();
        expect(component.changeSelectedHeight).toHaveBeenCalled();
    });

    it('should set selected height properly', () => {
        const height = 50;
        component.selectedHeight = 0;
        spyOn(component, 'draw').and.stub();
        spyOn(component, 'getColor').and.stub();

        component.changeSelectedHeight(height);

        expect(component.selectedHeight).toEqual(height);
    });

    it('should draw on selected height change', () => {
        spyOn(component, 'draw').and.stub();
        spyOn(component, 'getColor').and.stub();
        component.changeSelectedHeight(0);
        expect(component.draw).toHaveBeenCalled();
    });

    it('mouse move should not update without mouse down', () => {
        component.leftMouseDown = false;
        spyOn(component, 'changeSelectedHeight').and.stub();
        component.onMouseMove(new MouseEvent('mousemove'));
        expect(component.changeSelectedHeight).not.toHaveBeenCalled();
    });

    it('mouse move should update when mouse down', () => {
        component.leftMouseDown = true;
        spyOn(component, 'changeSelectedHeight').and.stub();
        component.onMouseMove(new MouseEvent('mousemove'));
        expect(component.changeSelectedHeight).toHaveBeenCalled();
    });

    it('should select good height for red hue', () => {
        component.selectedHeight = 0;
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
        component.selectedHeight = 0;
        component.setPositionToHue(Colors.GRAY);
        expect(component.selectedHeight).toEqual(0);
    });

    it('should set mousedown to false on mouse up', () => {
        component.leftMouseDown = true;
        component.onMouseUp(new MouseEvent('mouseUp'));
        expect(component.leftMouseDown).toBeFalse();
    });

    it('should get proper color', () => {
        const place = -1;
        const red: Color = component.getColor(component.RED_START);
        expect(red.r).toBeCloseTo(Colors.RED.r, place);
        expect(red.g).toBeCloseTo(Colors.RED.g, place);
        expect(red.b).toBeCloseTo(Colors.RED.b, place);
    });

    it('should not getContext if there', () => {
        // Get context to make sure we have one
        component.getContext();
        spyOn(component.canvas.nativeElement, 'getContext').and.stub();

        // Get context should not do anything since we already have it
        component.getContext();
        expect(component.canvas.nativeElement.getContext).not.toHaveBeenCalled();
    });
});
